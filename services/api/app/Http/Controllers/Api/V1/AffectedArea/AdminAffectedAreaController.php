<?php

namespace App\Http\Controllers\Api\V1\AffectedArea;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAffectedAreaController extends Controller
{
    /**
     * Fetch all affected areas with joined disaster details via raw SQL.
     */
    public function index(): JsonResponse
    {
        $areas = DB::select(<<<'SQL'
            SELECT 
                aa.area_id,
                aa.disaster_id,
                aa.location_id,
                aa.affected_population,
                aa.severity,
                aa.created_at,
                aa.updated_at,
                d.disaster_name,
                d.severity AS disaster_severity,
                d.status AS disaster_status
            FROM affected_areas aa
            LEFT JOIN disasters d ON aa.disaster_id = d.disaster_id
            ORDER BY aa.created_at DESC
        SQL);

        return response()->json(['data' => $areas]);
    }

    /**
     * Store new affected area via raw SQL INSERT.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'disaster_id' => 'required|integer|exists:disasters,disaster_id',
            'location_id' => 'nullable|integer',
            'affected_population' => 'required|integer|min:0',
            'severity' => 'required|string|max:50',
        ]);

        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO affected_areas (disaster_id, location_id, affected_population, severity, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        SQL, [
            $validated['disaster_id'],
            $validated['location_id'] ?? null,
            $validated['affected_population'],
            $validated['severity'],
            $now,
            $now,
        ]);

        $insertedId = DB::getPdo()->lastInsertId();

        $area = DB::selectOne(<<<'SQL'
            SELECT 
                aa.area_id,
                aa.disaster_id,
                aa.location_id,
                aa.affected_population,
                aa.severity,
                aa.created_at,
                d.disaster_name
            FROM affected_areas aa
            LEFT JOIN disasters d ON aa.disaster_id = d.disaster_id
            WHERE aa.area_id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $area], 201);
    }

    /**
     * Delete affected area via raw SQL DELETE.
     */
    public function destroy(int|string $affectedArea): JsonResponse
    {
        $areaId = is_numeric($affectedArea) ? (int) $affectedArea : 0;

        DB::delete(<<<'SQL'
            DELETE FROM affected_areas
            WHERE area_id = ?
        SQL, [$areaId]);

        return response()->json(null, 204);
    }
}
