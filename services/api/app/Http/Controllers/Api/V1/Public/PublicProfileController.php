<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicProfileResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

/**
 * Public profile lookup at `/u/{username}`.
 *
 * No authentication required — but we deliberately only return fields
 * already exposed via {@see \App\Http\Resources\PublicProfileResource}.
 *
 * Username resolution accepts either `users.user_id` (the public-facing
 * username column) or `users.name`. 404 when neither matches, so users
 * who haven't set a username don't leak existence.
 */
class PublicProfileController extends Controller
{
    public function show(string $username): JsonResponse
    {
        $user = User::query()
            ->where(function ($q) use ($username): void {
                $q->where('user_id', $username)->orWhere('name', $username);
            })
            ->first();

        if ($user === null) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        return response()->json([
            'data' => (new PublicProfileResource($user))->resolve(),
        ]);
    }
}
