<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RequestDataExportRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DataExportController extends Controller
{
    /**
     * Latest export request for the current user, or a placeholder when
     * none has been queued. Always returns a single record — the table
     * is small per-user and the UI only ever shows the most recent state.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $export = DB::selectOne(<<<'SQL'
            SELECT
                id,
                user_id,
                status,
                download_path,
                ready_at,
                expires_at,
                created_at,
                updated_at
            FROM data_export_requests
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 1
        SQL, [$user->id]);

        if ($export === null) {
            $export = (object) [
                'id' => null,
                'user_id' => $user->id,
                'status' => 'none',
                'download_path' => null,
                'ready_at' => null,
                'expires_at' => null,
                'created_at' => null,
                'updated_at' => null,
            ];
        }

        return response()->json(['data' => $export]);
    }

    /**
     * Queue a fresh data export. Idempotent — if the latest record is
     * already queued or processing we return it instead of creating a
     * duplicate. Otherwise we mark it queued and the worker (future)
     * will progress it.
     */
    public function store(RequestDataExportRequest $request): JsonResponse
    {
        $user = $request->user();

        $latest = DB::selectOne(<<<'SQL'
            SELECT * FROM data_export_requests
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 1
        SQL, [$user->id]);

        if ($latest && in_array($latest->status, ['queued', 'processing'], true)) {
            return response()->json(['data' => $latest]);
        }

        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO data_export_requests (user_id, status, created_at, updated_at)
            VALUES (?, 'queued', ?, ?)
        SQL, [$user->id, $now, $now]);

        $insertedId = DB::getPdo()->lastInsertId();

        $export = DB::selectOne(<<<'SQL'
            SELECT * FROM data_export_requests WHERE id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $export]);
    }
}