<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RequestAccountDeletionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountDeletionController extends Controller
{
    /** Default grace period before permanent deletion. */
    private const GRACE_DAYS = 30;

    /**
     * Return the current pending/most-recent deletion request for the
     * authenticated user, or a placeholder when none exists. The
     * frontend uses this to drive the danger-zone UI.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $deletion = DB::selectOne(<<<'SQL'
            SELECT
                id,
                user_id,
                status,
                reason,
                scheduled_for,
                cancelled_at,
                completed_at,
                created_at,
                updated_at
            FROM account_deletion_requests
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 1
        SQL, [$user->id]);

        if ($deletion === null) {
            $deletion = (object) [
                'id' => null,
                'user_id' => $user->id,
                'status' => 'none',
                'reason' => null,
                'scheduled_for' => null,
                'cancelled_at' => null,
                'completed_at' => null,
                'created_at' => null,
                'updated_at' => null,
            ];
        }

        return response()->json(['data' => $deletion]);
    }

    /**
     * Schedule a deletion request. Cancels any previous pending request
     * so we never have two overlapping deletion windows.
     */
    public function store(RequestAccountDeletionRequest $request): JsonResponse
    {
        $user = $request->user();
        $now = now();

        DB::update(<<<'SQL'
            UPDATE account_deletion_requests
            SET status = 'cancelled', cancelled_at = ?, updated_at = ?
            WHERE user_id = ? AND status = 'pending'
        SQL, [$now, $now, $user->id]);

        $scheduledFor = $now->copy()->addDays(self::GRACE_DAYS);

        DB::insert(<<<'SQL'
            INSERT INTO account_deletion_requests
                (user_id, status, scheduled_for, reason, created_at, updated_at)
            VALUES (?, 'pending', ?, ?, ?, ?)
        SQL, [
            $user->id,
            $scheduledFor,
            $request->validated('reason'),
            $now,
            $now,
        ]);

        $insertedId = DB::getPdo()->lastInsertId();

        $deletion = DB::selectOne(<<<'SQL'
            SELECT * FROM account_deletion_requests WHERE id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $deletion]);
    }

    /**
     * Cancel a pending deletion request before its grace window expires.
     */
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();
        $now = now();

        $deleted = DB::update(<<<'SQL'
            UPDATE account_deletion_requests
            SET status = 'cancelled', cancelled_at = ?, updated_at = ?
            WHERE user_id = ? AND status = 'pending'
        SQL, [$now, $now, $user->id]);

        if ($deleted === 0) {
            return response()->json([
                'message' => 'No pending deletion request to cancel.',
            ], 404);
        }

        return response()->json([
            'message' => 'Deletion request cancelled.',
        ]);
    }
}