<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller
{
    /**
     * Return the calling user's current session metadata. Backed by the
     * `login_audits` table so the UI doesn't have to maintain its own
     * "last active" clock.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $currentSessionId = $request->session()->getId();

        // The most recent successful audit for this user is treated as the
        // active session.
        $audit = DB::selectOne(<<<'SQL'
            SELECT signed_in_at
            FROM login_audits
            WHERE user_id = ? AND successful = 1
            ORDER BY signed_in_at DESC
            LIMIT 1
        SQL, [$user->id]);

        $lastActive = $audit?->signed_in_at ?? now()->toIso8601String();

        return response()->json([
            'data' => [
                'id' => $currentSessionId,
                'ip' => $request->ip() ?? '0.0.0.0',
                'user_agent' => $request->userAgent() ?? 'unknown',
                'last_active_at' => $lastActive,
                'is_current' => true,
            ],
        ]);
    }

    /**
     * List every active session for the current user by reading the
     * `sessions` table directly. Each row is hydrated so the UI can
     * render a per-row "This device" badge.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $currentSessionId = $request->session()->getId();

        $rows = DB::select(<<<'SQL'
            SELECT id, ip_address, user_agent, last_activity
            FROM sessions
            WHERE user_id = ?
            ORDER BY last_activity DESC
        SQL, [$user->id]);

        $data = array_map(function (object $row) use ($request, $currentSessionId): array {
            return [
                'id' => $row->id,
                'is_current' => $row->id === $currentSessionId,
                'ip' => $row->ip_address ?? $request->ip() ?? '0.0.0.0',
                'user_agent' => $row->user_agent ?? 'unknown',
                'last_active_at' => isset($row->last_activity)
                    ? CarbonImmutable::createFromTimestamp($row->last_activity)->toIso8601String()
                    : now()->toIso8601String(),
            ];
        }, $rows);

        return response()->json(['data' => $data]);
    }

    /**
     * Sign every session out except the one making this request. Returns
     * a count so the UI can surface "Signed out of N other device(s)".
     */
    public function destroyAll(Request $request): JsonResponse
    {
        $user = $request->user();
        $currentSessionId = $request->session()->getId();

        if ($currentSessionId) {
            $deleted = DB::delete(<<<'SQL'
                DELETE FROM sessions
                WHERE user_id = ? AND id != ?
            SQL, [$user->id, $currentSessionId]);
        } else {
            $deleted = DB::delete(<<<'SQL'
                DELETE FROM sessions
                WHERE user_id = ?
            SQL, [$user->id]);
        }

        return response()->json([
            'message' => $deleted === 1
                ? 'Signed out of 1 other device.'
                : "Signed out of {$deleted} other devices.",
            'revoked_count' => $deleted,
        ]);
    }

    /**
     * Revoke a single session owned by the caller. The current session
     * cannot revoke itself — users sign out of the current device from
     * the account menu, not from the sessions list.
     */
    public function destroyOne(Request $request, string $sessionId): JsonResponse
    {
        $user = $request->user();
        $currentSessionId = $request->session()->getId();

        abort_if(
            $sessionId === $currentSessionId,
            422,
            'Use the account menu to sign out of this device.'
        );

        $deleted = DB::delete(<<<'SQL'
            DELETE FROM sessions
            WHERE user_id = ? AND id = ?
        SQL, [$user->id, $sessionId]);

        if ($deleted === 0) {
            return response()->json(
                ['message' => 'Session not found or already revoked.'],
                404
            );
        }

        return response()->json([
            'message' => 'Session revoked.',
            'revoked_count' => $deleted,
        ]);
    }
}