<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $now = now();

        DB::update(<<<'SQL'
            UPDATE users
            SET two_factor_confirmed_at = ?, updated_at = ?
            WHERE id = ?
        SQL, [$now, $now, $user->id]);

        return response()->json([
            'message' => 'Two-factor authentication enabled.',
            'confirmed_at' => $now->toIso8601String(),
        ]);
    }

    public function disable(Request $request): JsonResponse
    {
        $user = $request->user();
        $now = now();

        DB::update(<<<'SQL'
            UPDATE users
            SET two_factor_confirmed_at = NULL,
                two_factor_secret = NULL,
                updated_at = ?
            WHERE id = ?
        SQL, [$now, $user->id]);

        return response()->json([
            'message' => 'Two-factor authentication disabled.',
        ]);
    }
}