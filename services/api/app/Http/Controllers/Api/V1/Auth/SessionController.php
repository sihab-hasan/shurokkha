<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\SessionResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class SessionController extends Controller
{
    /**
     * Return the calling user's current session metadata. Backed by the
     * `login_audits` table so the UI doesn't have to maintain its own
     * "last active" clock.
     */
    public function show(Request $request): SessionResource
    {
        $user = $request->user();

        Gate::authorize('view-session', $user);

        $currentSessionId = $request->session()->getId();

        // The most recent successful audit for this user is treated as the
        // active session.
        $audit = $user->loginAudits()->successful()->latest('signed_in_at')->first();
        $lastActive = $audit?->signed_in_at?->toIso8601String() ?? now()->toIso8601String();

        $payload = [
            'id' => $currentSessionId,
            'ip' => $request->ip() ?? '0.0.0.0',
            'user_agent' => $request->userAgent() ?? 'unknown',
            'last_active_at' => $lastActive,
            'is_current' => true,
        ];

        return new SessionResource($payload);
    }

    /**
     * List every active session for the current user by reading the
     * `sessions` table directly. Each row is hydrated into a
     * `SessionResource` so the UI can render a per-row "This device"
     * badge.
     */
    public function index(Request $request): JsonResource
    {
        $user = $request->user();

        Gate::authorize('view-session', $user);

        $currentSessionId = $request->session()->getId();

        $rows = DB::table('sessions')
            ->where('user_id', $user->id)
            ->orderByDesc('last_activity')
            ->get()
            ->map(function ($row) use ($request, $currentSessionId) {
                $payload = (array) $row;
                $payload['is_current'] = $payload['id'] === $currentSessionId;
                $payload['ip'] = $payload['ip_address'] ?? $request->ip() ?? '0.0.0.0';
                $payload['user_agent'] = $payload['user_agent'] ?? 'unknown';
                $payload['last_active_at'] = isset($payload['last_activity'])
                    ? \Carbon\CarbonImmutable::createFromTimestamp($payload['last_activity'])->toIso8601String()
                    : now()->toIso8601String();
                return $payload;
            })
            ->values();

        return SessionResource::collection($rows);
    }

    /**
     * Sign every session out except the one making this request. Returns
     * a count so the UI can surface "Signed out of N other device(s)".
     */
    public function destroyAll(Request $request): JsonResponse
    {
        $user = $request->user();

        Gate::authorize('view-session', $user);

        $currentSessionId = $request->session()->getId();

        $deleted = DB::table('sessions')
            ->where('user_id', $user->id)
            ->when($currentSessionId, function ($query, string $id): void {
                $query->where('id', '!=', $id);
            })
            ->delete();

        return response()->json([
            'message' => $deleted === 1
                ? 'Signed out of 1 other device.'
                : "Signed out of {$deleted} other devices.",
            'revoked_count' => $deleted,
        ]);
    }
}