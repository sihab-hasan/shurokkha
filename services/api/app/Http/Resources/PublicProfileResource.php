<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public-facing projection of a user profile (`/u/{username}`).
 *
 * The auth `ProfileResource` exposes email, phone, timezone, etc —
 * private by definition. This resource intentionally returns only what
 * a guest should see: display name, username, role, bio, location,
 * join date, public contribution metrics.
 *
 * `username` lookup is by `users.user_id` (the public-facing id column)
 * OR `users.name` so the same route accepts either shape; the frontend
 * decodes both into a stable URL.
 */
class PublicProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var \App\Models\User $user */
        $user = $this->resource;

        $createdAt = $user->created_at;

        // Aggregate metrics are scoped to public contributions only —
        // donations marked as one_time/recurring are summed on demand.
        $donationCount = (int) ($user->donations()->count());
        $assistanceCount = (int) ($user->assistanceRequests()->count());

        return [
            'user_id' => $user->user_id ?? $user->id,
            'name' => $user->full_name ?? $user->name,
            'username' => $user->user_id ?? $user->name,
            'role' => $user->role?->value ?? 'user',
            'bio' => null,
            'location' => null,
            'joined_at' => $createdAt?->toIso8601String(),
            'avatar_url' => $user->avatar_url ?? null,
            'metrics' => [
                'donations' => $donationCount,
                'assistance_requests' => $assistanceCount,
            ],
        ];
    }
}
