<?php

namespace App\Services;

use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Support\Str;

class ApiTokenService
{
    public function issue(User $user, string $name = 'web'): string
    {
        $plainTextToken = Str::random(80);

        $user->apiTokens()->create([
            'name' => $name,
            'token_hash' => hash('sha256', $plainTextToken),
            'expires_at' => now()->addDays(30),
        ]);

        return $plainTextToken;
    }

    public function findActive(string $plainTextToken): ?ApiToken
    {
        $token = ApiToken::query()
            ->with('user')
            ->where('token_hash', hash('sha256', $plainTextToken))
            ->first();

        if ($token === null || $token->isExpired()) {
            return null;
        }

        return $token;
    }
}
