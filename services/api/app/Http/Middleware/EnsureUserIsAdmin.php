<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gate admin-only routes. The user must be authenticated AND have
 * the `admin` role. Returns 401 when unauthenticated, 403 when
 * authenticated but not an admin.
 *
 * Register the alias `role` in bootstrap/app.php and use it as
 * `Route::middleware(['auth', 'role:admin'])` on route groups.
 */
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next, string $role = 'admin'): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $actual = is_object($user->role) ? ($user->role->value ?? null) : $user->role;

        if ($actual !== $role) {
            return response()->json([
                'message' => "This action requires the {$role} role.",
            ], 403);
        }

        return $next($request);
    }
}
