<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RescueTeamController extends Controller
{
    /**
     * Fetch all rescue teams with assignment counts via raw SQL (LEFT JOIN + GROUP BY).
     */
    public function index(): JsonResponse
    {
        $teams = DB::select(<<<'SQL'
            SELECT 
                rt.team_id,
                rt.team_name,
                rt.team_type,
                rt.availability,
                rt.created_at,
                rt.updated_at,
                COUNT(tm.assignment_id) AS total_assignments
            FROM rescue_teams rt
            LEFT JOIN team_management tm ON rt.team_id = tm.team_id
            GROUP BY rt.team_id, rt.team_name, rt.team_type, rt.availability, rt.created_at, rt.updated_at
            ORDER BY rt.team_id ASC
        SQL);

        return response()->json(['data' => $teams]);
    }

    /**
     * Store a new rescue team via raw SQL INSERT.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'team_name' => 'required|string|max:100',
            'team_type' => 'required|string|max:50',
            'availability' => 'required|string|max:50',
        ]);

        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO rescue_teams (team_name, team_type, availability, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        SQL, [
            $validated['team_name'],
            $validated['team_type'],
            $validated['availability'],
            $now,
            $now,
        ]);

        $insertedId = DB::getPdo()->lastInsertId();

        $team = DB::selectOne(<<<'SQL'
            SELECT * FROM rescue_teams WHERE team_id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $team], 201);
    }

    /**
     * Delete rescue team via raw SQL DELETE.
     */
    public function destroy(int|string $rescueTeam): JsonResponse
    {
        $teamId = is_numeric($rescueTeam) ? (int) $rescueTeam : 0;

        DB::delete(<<<'SQL'
            DELETE FROM rescue_teams
            WHERE team_id = ?
        SQL, [$teamId]);

        return response()->json(null, 204);
    }
}
