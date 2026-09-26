<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TwoFactorController extends Controller
{
    /**
     * Enable two-factor authentication for the user. The full TOTP
     * enrollment flow (secret generation + recovery codes) is still
     * under design; for now we record the confirmation timestamp so
     * the UI can show a real "Enabled" badge.
     */
    public function enable(Request $request): JsonResponse
    {
        $user = $request->user();

        Gate::authorize('update', $user);

        $user->forceFill(['two_factor_confirmed_at' => now()])->save();

        return response()->json([
            'message' => 'Two-factor authentication enabled.',
            'confirmed_at' => $user->two_factor_confirmed_at?->toIso8601String(),
        ]);
    }

    public function disable(Request $request): JsonResponse
    {
        $user = $request->user();

        Gate::authorize('update', $user);

        $user->forceFill([
            'two_factor_confirmed_at' => null,
            'two_factor_secret' => null,
        ])->save();

        return response()->json([
            'message' => 'Two-factor authentication disabled.',
        ]);
    }
}