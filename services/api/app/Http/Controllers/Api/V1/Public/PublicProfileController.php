<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Public profile lookup at `/u/{username}`.
 *
 * No authentication required — but we deliberately only return fields
 * that are safe to expose publicly.
 *
 * Username resolution accepts either `users.user_id` (the public-facing
 * username column) or `users.name`. 404 when neither matches, so users
 * who haven't set a username don't leak existence.
 */
class PublicProfileController extends Controller
{
    public function show(string $username): JsonResponse
    {
        $user = DB::selectOne(<<<'SQL'
            SELECT
                u.user_id,
                u.full_name,
                u.name,
                u.email,
                u.bio,
                u.avatar_path,
                u.created_at
            FROM users u
            WHERE u.user_id = ? OR u.name = ?
            LIMIT 1
        SQL, [$username, $username]);

        if ($user === null) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        return response()->json(['data' => $user]);
    }
}
