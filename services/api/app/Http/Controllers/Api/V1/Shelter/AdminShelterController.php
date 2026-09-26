<?php

namespace App\Http\Controllers\Api\V1\Shelter;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminShelterController extends Controller
{
    /**
     * Fetch all shelters with joined affected area details via raw SQL.
     */
    public function index(): JsonResponse
    {
        $shelters = DB::select(<<<'SQL'
            SELECT 
                s.shelter_id,
                s.area_id,
                s.shelter_name,
                s.capacity,
                s.occupancy,
                s.status,
                s.created_at,
                s.updated_at,
                aa.severity AS area_severity,
                aa.affected_population
            FROM shelters s
            LEFT JOIN affected_areas aa ON s.area_id = aa.area_id
            ORDER BY s.created_at DESC
        SQL);

        return response()->json(['data' => $shelters]);
    }

    /**
     * Store new shelter via raw SQL INSERT.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'area_id' => 'nullable|integer|exists:affected_areas,area_id',
            'shelter_name' => 'required|string|max:150',
            'capacity' => 'required|integer|min:0',
            'occupancy' => 'required|integer|min:0|lte:capacity',
            'status' => 'required|string|max:50',
        ]);

        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO shelters (area_id, shelter_name, capacity, occupancy, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        SQL, [
            $validated['area_id'] ?? null,
            $validated['shelter_name'],
            $validated['capacity'],
            $validated['occupancy'],
            $validated['status'],
            $now,
            $now,
        ]);

        $insertedId = DB::getPdo()->lastInsertId();

        $shelter = DB::selectOne(<<<'SQL'
            SELECT 
                s.shelter_id,
                s.area_id,
                s.shelter_name,
                s.capacity,
                s.occupancy,
                s.status,
                s.created_at,
                aa.severity AS area_severity
            FROM shelters s
            LEFT JOIN affected_areas aa ON s.area_id = aa.area_id
            WHERE s.shelter_id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $shelter], 201);
    }

    /**
     * Delete shelter via raw SQL DELETE.
     */
    public function destroy(int|string $shelter): JsonResponse
    {
        $shelterId = is_numeric($shelter) ? (int) $shelter : 0;

        DB::delete(<<<'SQL'
            DELETE FROM shelters
            WHERE shelter_id = ?
        SQL, [$shelterId]);

        return response()->json(null, 204);
    }
}
