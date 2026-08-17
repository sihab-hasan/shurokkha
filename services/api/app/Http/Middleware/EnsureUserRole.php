<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    public function handle(Request $request, Closure $next, string $role): Response|JsonResponse
    {
        $requiredRole = UserRole::tryFrom($role);
        $user = $request->user();

        if ($requiredRole === null || $user === null || $user->role !== $requiredRole) {
            return response()->json([
                'message' => 'You do not have access to this workspace.',
            ], 403);
        }

        return $next($request);
    }
}
