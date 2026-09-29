<?php

namespace App\Http\Controllers\Api\V1\ShelterResidency;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ShelterResidency\CheckoutShelterResidencyRequest;
use App\Http\Requests\Api\V1\ShelterResidency\StoreShelterResidencyRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Authenticated citizen shelter-residency endpoints.
 *
 *   GET    /v1/auth/me/shelter-residency        — current user's active residency
 *   POST   /v1/auth/me/shelter-residency        — self check-in
 *   PATCH  /v1/auth/me/shelter-residency/checkout — self check-out
 */
class CitizenShelterResidencyController extends Controller
{
    public function show(): JsonResponse
    {
        $userId = auth()->id();

        $row = DB::selectOne(<<<'SQL'
            SELECT
                r.*, s.shelter_name, s.capacity, s.occupancy
            FROM shelter_residencies r
            LEFT JOIN shelters s ON r.shelter_id = s.shelter_id
            WHERE r.user_id = ? AND r.status = 'checked_in'
            ORDER BY r.checked_in_at DESC
            LIMIT 1
        SQL, [$userId]);

        if (! $row) {
            return response()->json(['data' => null]);
        }

        return response()->json(['data' => $row]);
    }

    public function store(StoreShelterResidencyRequest $request): JsonResponse
    {
        $userId = auth()->id();
        $existing = DB::selectOne(
            "SELECT residency_id FROM shelter_residencies WHERE user_id = ? AND status = 'checked_in'",
            [$userId]
        );

        if ($existing) {
            return response()->json([
                'message' => 'You are already checked into a shelter. Check out first.',
            ], 409);
        }

        $v = $request->validated();
        $now = now();

        // Pre-fill full_name/phone from the user if not provided.
        $user = DB::selectOne('SELECT full_name, phone FROM users WHERE id = ?', [$userId]);

        DB::insert(<<<'SQL'
            INSERT INTO shelter_residencies
                (shelter_id, user_id, full_name, phone, age, gender,
                 notes, status, checked_in_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'checked_in', ?, ?, ?)
        SQL, [
            $v['shelter_id'],
            $userId,
            $v['full_name'] ?? $user?->full_name,
            $v['phone'] ?? $user?->phone,
            $v['age'] ?? null,
            $v['gender'] ?? null,
            $v['notes'] ?? null,
            $now,
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();
        $row = DB::selectOne('SELECT * FROM shelter_residencies WHERE residency_id = ?', [$id]);

        return response()->json(['data' => $row], 201);
    }

    public function checkout(CheckoutShelterResidencyRequest $request): JsonResponse
    {
        $userId = auth()->id();
        $now = now();

        $existing = DB::selectOne(
            "SELECT residency_id FROM shelter_residencies WHERE user_id = ? AND status = 'checked_in' ORDER BY checked_in_at DESC LIMIT 1",
            [$userId]
        );

        if (! $existing) {
            return response()->json(['message' => 'No active check-in to end.'], 404);
        }

        DB::update(<<<'SQL'
            UPDATE shelter_residencies SET
                status = 'checked_out',
                checked_out_at = ?,
                updated_at = ?
            WHERE residency_id = ?
        SQL, [$now, $now, $existing->residency_id]);

        // Return the most-recent residency (regardless of status) so the
        // caller sees the checkout reflected in the response payload.
        $row = DB::selectOne(
            'SELECT * FROM shelter_residencies WHERE user_id = ? ORDER BY checked_in_at DESC LIMIT 1',
            [$userId]
        );

        return response()->json(['data' => $row]);
    }
}
