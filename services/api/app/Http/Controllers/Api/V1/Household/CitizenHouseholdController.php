<?php

namespace App\Http\Controllers\Api\V1\Household;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Household\StoreHouseholdMemberRequest;
use App\Http\Requests\Api\V1\Household\StoreHouseholdRequest;
use App\Http\Requests\Api\V1\Household\UpdateHouseholdMemberRequest;
use App\Http\Requests\Api\V1\Household\UpdateHouseholdRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Authenticated citizen endpoints for managing the caller's own household
 * and the members under it.
 *
 *   GET    /v1/auth/me/household                — current user's household + members
 *   POST   /v1/auth/me/household                — create a new household (one per user)
 *   PATCH  /v1/auth/me/household                — update household fields
 *   POST   /v1/auth/me/household/members        — add a member
 *   PATCH  /v1/auth/me/household/members/{id}   — update a member
 *   DELETE /v1/auth/me/household/members/{id}   — remove a member
 */
class CitizenHouseholdController extends Controller
{
    public function show(): JsonResponse
    {
        $userId = auth()->id();

        $household = DB::selectOne('SELECT * FROM households WHERE user_id = ?', [$userId]);

        if (! $household) {
            return response()->json(['data' => null]);
        }

        $members = DB::select(
            'SELECT * FROM household_members WHERE household_id = ? ORDER BY member_id ASC',
            [$household->household_id]
        );

        return response()->json([
            'data' => [
                'household' => $household,
                'members' => $members,
            ],
        ]);
    }

    public function indexMembers(): JsonResponse
    {
        $userId = auth()->id();

        $household = DB::selectOne('SELECT household_id FROM households WHERE user_id = ?', [$userId]);

        if (! $household) {
            return response()->json(['data' => []]);
        }

        $members = DB::select(
            'SELECT * FROM household_members WHERE household_id = ? ORDER BY member_id ASC',
            [$household->household_id]
        );

        return response()->json(['data' => $members]);
    }

    public function store(StoreHouseholdRequest $request): JsonResponse
    {
        $userId = auth()->id();
        $existing = DB::selectOne('SELECT household_id FROM households WHERE user_id = ?', [$userId]);

        if ($existing) {
            return response()->json([
                'message' => 'You already have a household. Use PATCH to update it.',
            ], 409);
        }

        $v = $request->validated();
        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO households
                (user_id, head_full_name, phone, address, latitude, longitude,
                 member_count, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        SQL, [
            $userId,
            $v['head_full_name'],
            $v['phone'],
            $v['address'],
            $v['latitude'] ?? null,
            $v['longitude'] ?? null,
            $v['member_count'] ?? 1,
            $v['notes'] ?? null,
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();
        $row = DB::selectOne('SELECT * FROM households WHERE household_id = ?', [$id]);

        return response()->json(['data' => $row], 201);
    }

    public function update(UpdateHouseholdRequest $request): JsonResponse
    {
        $userId = auth()->id();
        $v = $request->validated();
        $now = now();

        $existing = DB::selectOne('SELECT household_id FROM households WHERE user_id = ?', [$userId]);

        if (! $existing) {
            return response()->json(['message' => 'No household found to update.'], 404);
        }

        $sets = [];
        $bindings = [];
        foreach (['head_full_name', 'phone', 'address', 'latitude', 'longitude', 'member_count', 'notes'] as $field) {
            if (array_key_exists($field, $v)) {
                $sets[] = "$field = ?";
                $bindings[] = $v[$field];
            }
        }
        if (! empty($sets)) {
            $sets[] = 'updated_at = ?';
            $bindings[] = $now;
            $bindings[] = $existing->household_id;
            DB::update('UPDATE households SET ' . implode(', ', $sets) . ' WHERE household_id = ?', $bindings);
        }

        $row = DB::selectOne('SELECT * FROM households WHERE household_id = ?', [$existing->household_id]);

        return response()->json(['data' => $row]);
    }

    public function storeMember(StoreHouseholdMemberRequest $request): JsonResponse
    {
        $userId = auth()->id();
        $household = DB::selectOne('SELECT household_id FROM households WHERE user_id = ?', [$userId]);

        if (! $household) {
            return response()->json([
                'message' => 'Create a household before adding members.',
            ], 409);
        }

        $v = $request->validated();
        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO household_members
                (household_id, full_name, relationship, age, gender, phone, notes,
                 created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        SQL, [
            $household->household_id,
            $v['full_name'],
            $v['relationship'] ?? null,
            $v['age'] ?? null,
            $v['gender'] ?? null,
            $v['phone'] ?? null,
            $v['notes'] ?? null,
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();
        $row = DB::selectOne('SELECT * FROM household_members WHERE member_id = ?', [$id]);

        return response()->json(['data' => $row], 201);
    }

    public function updateMember(UpdateHouseholdMemberRequest $request, int|string $member): JsonResponse
    {
        $userId = auth()->id();
        $memberId = (int) $member;
        $v = $request->validated();
        $now = now();

        $household = DB::selectOne('SELECT household_id FROM households WHERE user_id = ?', [$userId]);
        if (! $household) {
            return response()->json(['message' => 'No household.'], 404);
        }

        $existing = DB::selectOne(
            'SELECT member_id FROM household_members WHERE member_id = ? AND household_id = ?',
            [$memberId, $household->household_id]
        );

        if (! $existing) {
            return response()->json(['message' => 'Member not found.'], 404);
        }

        $sets = [];
        $bindings = [];
        foreach (['full_name', 'relationship', 'age', 'gender', 'phone', 'notes'] as $field) {
            if (array_key_exists($field, $v)) {
                $sets[] = "$field = ?";
                $bindings[] = $v[$field];
            }
        }
        if (! empty($sets)) {
            $sets[] = 'updated_at = ?';
            $bindings[] = $now;
            $bindings[] = $memberId;
            DB::update('UPDATE household_members SET ' . implode(', ', $sets) . ' WHERE member_id = ?', $bindings);
        }

        $row = DB::selectOne('SELECT * FROM household_members WHERE member_id = ?', [$memberId]);

        return response()->json(['data' => $row]);
    }

    public function destroyMember(int|string $member): JsonResponse
    {
        $userId = auth()->id();
        $memberId = (int) $member;

        $household = DB::selectOne('SELECT household_id FROM households WHERE user_id = ?', [$userId]);
        if (! $household) {
            return response()->json(['message' => 'No household.'], 404);
        }

        $deleted = DB::delete(
            'DELETE FROM household_members WHERE member_id = ? AND household_id = ?',
            [$memberId, $household->household_id]
        );

        if (! $deleted) {
            return response()->json(['message' => 'Member not found.'], 404);
        }

        return response()->json(null, 204);
    }
}
