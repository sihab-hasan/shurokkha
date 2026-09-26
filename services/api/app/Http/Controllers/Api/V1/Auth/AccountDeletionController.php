<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RequestAccountDeletionRequest;
use App\Http\Resources\AccountDeletionRequestResource;
use App\Models\AccountDeletionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

class AccountDeletionController extends Controller
{
    /**
     * Return the current pending/most-recent deletion request for the
     * authenticated user, or a placeholder when none exists. The
     * frontend uses this to drive the danger-zone UI.
     */
    public function show(Request $request): JsonResource
    {
        $user = $request->user();

        $deletion = AccountDeletionRequest::query()
            ->where('user_id', $user->id)
            ->orderByDesc('id')
            ->first();

        if ($deletion) {
            return new AccountDeletionRequestResource($deletion);
        }

        return new AccountDeletionRequestResource(new AccountDeletionRequest([
            'user_id' => $user->id,
            'status' => 'none',
            'scheduled_for' => null,
        ]));
    }

    /**
     * Schedule a deletion request. Cancels any previous pending request
     * so we never have two overlapping deletion windows.
     */
    public function store(RequestAccountDeletionRequest $request): JsonResource
    {
        $user = $request->user();

        AccountDeletionRequest::query()
            ->where('user_id', $user->id)
            ->where('status', AccountDeletionRequest::STATUS_PENDING)
            ->update([
                'status' => AccountDeletionRequest::STATUS_CANCELLED,
                'cancelled_at' => now(),
            ]);

        $deletion = AccountDeletionRequest::query()->create([
            'user_id' => $user->id,
            'status' => AccountDeletionRequest::STATUS_PENDING,
            'scheduled_for' => AccountDeletionRequest::defaultSchedule(),
            'reason' => $request->validated('reason'),
        ]);

        return new AccountDeletionRequestResource($deletion);
    }

    /**
     * Cancel a pending deletion request before its grace window expires.
     */
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();

        $deleted = AccountDeletionRequest::query()
            ->where('user_id', $user->id)
            ->where('status', AccountDeletionRequest::STATUS_PENDING)
            ->update([
                'status' => AccountDeletionRequest::STATUS_CANCELLED,
                'cancelled_at' => now(),
            ]);

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