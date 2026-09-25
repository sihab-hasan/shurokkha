<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DisasterController extends Controller
{
    /**
     * Fetch all disasters with aggregate affected areas and population counts via raw SQL.
     */
    public function index(): JsonResponse
    {
        $disasters = DB::select(<<<'SQL'
            SELECT 
                d.disaster_id,
                d.disaster_name,
                d.severity,
                d.status,
                d.start_datetime,
                d.created_at,
                d.updated_at,
                COUNT(aa.area_id) AS total_affected_areas,
                COALESCE(SUM(aa.affected_population), 0) AS total_affected_population
            FROM disasters d
            LEFT JOIN affected_areas aa ON d.disaster_id = aa.disaster_id
            GROUP BY d.disaster_id, d.disaster_name, d.severity, d.status, d.start_datetime, d.created_at, d.updated_at
            ORDER BY d.created_at DESC
        SQL);

        return response()->json(['data' => $disasters]);
    }

    /**
     * Store a new disaster via raw SQL INSERT.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'disaster_name' => 'required|string|max:150',
            'severity' => 'required|string|max:50',
            'status' => 'required|string|max:50',
            'start_datetime' => 'nullable|date',
        ]);

        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO disasters (disaster_name, severity, status, start_datetime, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        SQL, [
            $validated['disaster_name'],
            $validated['severity'],
            $validated['status'],
            $validated['start_datetime'] ?? $now,
            $now,
            $now,
        ]);

        $insertedId = DB::getPdo()->lastInsertId();

        $disaster = DB::selectOne(<<<'SQL'
            SELECT * FROM disasters WHERE disaster_id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $disaster], 201);
    }
}
