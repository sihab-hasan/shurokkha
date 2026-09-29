<?php

namespace App\Http\Controllers\Api\V1\ShelterResidency;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ShelterResidency\CheckoutShelterResidencyRequest;
use App\Http\Requests\Api\V1\ShelterResidency\StoreShelterResidencyRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin CRUD over shelter residencies (check-ins). Citizens register
 * themselves at /v1/auth/me/shelter-residency.
 */
class AdminShelterResidencyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $shelterId = $request->query('shelter_id');
        $status = $request->query('status');

        $sql = <<<'SQL'
            SELECT
                r.residency_id, r.shelter_id, r.user_id, r.household_id,
                r.full_name, r.phone, r.age, r.gender, r.notes,
                r.status, r.checked_in_at, r.checked_out_at,
                r.created_at, r.updated_at,
                s.shelter_name, u.full_name AS user_name
            FROM shelter_residencies r
            LEFT JOIN shelters s ON r.shelter_id = s.shelter_id
            LEFT JOIN users u ON r.user_id = u.id
            SQL;

        $bindings = [];
        $where = [];
        if (is_string($shelterId) && $shelterId !== '') {
            $where[] = 'r.shelter_id = ?';
            $bindings[] = (int) $shelterId;
        }
        if (is_string($status) && $status !== '') {
            $where[] = 'r.status = ?';
            $bindings[] = $status;
        }
        if (! empty($where)) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY r.checked_in_at DESC';

        return response()->json(['data' => DB::select($sql, $bindings)]);
    }

    public function show(int|string $residency): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                r.*, s.shelter_name, u.full_name AS user_name
            FROM shelter_residencies r
            LEFT JOIN shelters s ON r.shelter_id = s.shelter_id
            LEFT JOIN users u ON r.user_id = u.id
            WHERE r.residency_id = ?
        SQL, [(int) $residency]);

        if (! $row) {
            return response()->json(['message' => 'Residency not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }

    public function store(StoreShelterResidencyRequest $request): JsonResponse
    {
        $v = $request->validated();
        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO shelter_residencies
                (shelter_id, user_id, household_id, full_name, phone, age, gender,
                 notes, status, checked_in_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'checked_in', ?, ?, ?)
        SQL, [
            $v['shelter_id'],
            $v['user_id'] ?? null,
            $v['household_id'] ?? null,
            $v['full_name'],
            $v['phone'] ?? null,
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

    public function checkout(CheckoutShelterResidencyRequest $request, int|string $residency): JsonResponse
    {
        $residencyId = (int) $residency;
        $now = now();

        $existing = DB::selectOne('SELECT residency_id, status FROM shelter_residencies WHERE residency_id = ?', [$residencyId]);
        if (! $existing) {
            return response()->json(['message' => 'Residency not found.'], 404);
        }

        DB::update(<<<'SQL'
            UPDATE shelter_residencies SET
                status = 'checked_out',
                checked_out_at = ?,
                updated_at = ?
            WHERE residency_id = ?
        SQL, [$now, $now, $residencyId]);

        return $this->show($residencyId);
    }

    public function destroy(int|string $residency): JsonResponse
    {
        DB::delete('DELETE FROM shelter_residencies WHERE residency_id = ?', [(int) $residency]);

        return response()->json(null, 204);
    }
}
