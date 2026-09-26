<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RequestDataExportRequest;
use App\Http\Resources\DataExportRequestResource;
use App\Models\DataExportRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

class DataExportController extends Controller
{
    /**
     * Latest export request for the current user, or null when none has
     * been queued. Always returns a single record — the table is small
     * per-user and the UI only ever shows the most recent state.
     */
    public function show(Request $request): JsonResource
    {
        $user = $request->user();

        $export = DataExportRequest::query()
            ->where('user_id', $user->id)
            ->orderByDesc('id')
            ->first();

        return $export
            ? new DataExportRequestResource($export)
            : new DataExportRequestResource(new DataExportRequest([
                'user_id' => $user->id,
                'status' => 'none',
            ]));
    }

    /**
     * Queue a fresh data export. Idempotent — if the latest record is
     * already queued or processing we return it instead of creating a
     * duplicate. Otherwise we mark it queued and the worker (future)
     * will progress it.
     */
    public function store(RequestDataExportRequest $request): DataExportRequestResource
    {
        $user = $request->user();

        $latest = DataExportRequest::query()
            ->where('user_id', $user->id)
            ->orderByDesc('id')
            ->first();

        if ($latest && in_array($latest->status, [
            DataExportRequest::STATUS_QUEUED,
            DataExportRequest::STATUS_PROCESSING,
        ], true)) {
            return new DataExportRequestResource($latest);
        }

        $export = DataExportRequest::query()->create([
            'user_id' => $user->id,
            'status' => DataExportRequest::STATUS_QUEUED,
        ]);

        return new DataExportRequestResource($export);
    }
}