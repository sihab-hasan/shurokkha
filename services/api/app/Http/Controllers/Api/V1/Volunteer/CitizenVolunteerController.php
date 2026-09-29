<?php

namespace App\Http\Controllers\Api\V1\Volunteer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Volunteer\StoreVolunteerRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Authenticated citizen volunteer application endpoints.
 *
 *   GET   /v1/auth/me/volunteer        — current user's application (or null)
 *   POST  /v1/auth/me/volunteer        — submit a new application
 *   PATCH /v1/auth/me/volunteer        — update pending application fields
 */
class CitizenVolunteerController extends Controller
{
    public function show(): JsonResponse
    {
        $userId = auth()->id();

        $row = DB::selectOne(
            'SELECT * FROM volunteers WHERE user_id = ? ORDER BY volunteer_id DESC LIMIT 1',
            [$userId]
        );

        if (! $row) {
            return response()->json(['data' => null]);
        }

        return response()->json(['data' => $row]);
    }

    public function store(StoreVolunteerRequest $request): JsonResponse
    {
        $v = $request->validated();
        $userId = auth()->id();
        $now = now();

        // Block duplicate active applications.
        $existing = DB::selectOne(
            "SELECT volunteer_id FROM volunteers WHERE user_id = ? AND status IN ('pending','approved')",
            [$userId]
        );

        if ($existing) {
            return response()->json([
                'message' => 'You already have an active volunteer application.',
            ], 409);
        }

        // Look up the user's name/email to denormalize onto the application.
        $user = DB::selectOne('SELECT full_name, email FROM users WHERE id = ?', [$userId]);

        DB::insert(<<<'SQL'
            INSERT INTO volunteers
                (user_id, full_name, phone, email, address, skills, availability,
                 motivation, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
        SQL, [
            $userId,
            $v['full_name'],
            $v['phone'],
            $v['email'] ?? $user?->email,
            $v['address'] ?? null,
            $v['skills'] ?? null,
            $v['availability'] ?? null,
            $v['motivation'] ?? null,
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();
        $row = DB::selectOne('SELECT * FROM volunteers WHERE volunteer_id = ?', [$id]);

        return response()->json(['data' => $row], 201);
    }

    public function update(StoreVolunteerRequest $request): JsonResponse
    {
        $v = $request->validated();
        $userId = auth()->id();
        $now = now();

        $existing = DB::selectOne(
            "SELECT volunteer_id, status FROM volunteers WHERE user_id = ? ORDER BY volunteer_id DESC LIMIT 1",
            [$userId]
        );

        if (! $existing) {
            return response()->json([
                'message' => 'No volunteer application found to update.',
            ], 404);
        }

        if ($existing->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending applications can be edited.',
            ], 409);
        }

        $sets = [];
        $bindings = [];
        foreach (['full_name', 'phone', 'email', 'address', 'skills', 'availability', 'motivation'] as $field) {
            if (array_key_exists($field, $v)) {
                $sets[] = "$field = ?";
                $bindings[] = $v[$field];
            }
        }
        if (! empty($sets)) {
            $sets[] = 'updated_at = ?';
            $bindings[] = $now;
            $bindings[] = $existing->volunteer_id;
            DB::update('UPDATE volunteers SET ' . implode(', ', $sets) . ' WHERE volunteer_id = ?', $bindings);
        }

        $row = DB::selectOne('SELECT * FROM volunteers WHERE volunteer_id = ?', [$existing->volunteer_id]);

        return response()->json(['data' => $row]);
    }
}
