<?php

namespace App\Http\Middleware;

use App\Services\ApiTokenService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiToken
{
    public function __construct(private readonly ApiTokenService $tokens)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $plainTextToken = $request->bearerToken();

        if ($plainTextToken === null) {
            return $this->unauthenticated();
        }

        $token = $this->tokens->findActive($plainTextToken);

        if ($token === null || $token->user === null) {
            return $this->unauthenticated();
        }

        Auth::setUser($token->user);
        $request->setUserResolver(fn () => $token->user);
        $request->attributes->set('api_token', $token);

        if ($token->last_used_at === null || $token->last_used_at->lt(now()->subMinutes(5))) {
            $token->forceFill(['last_used_at' => now()])->saveQuietly();
        }

        return $next($request);
    }

    private function unauthenticated(): JsonResponse
    {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }
}
