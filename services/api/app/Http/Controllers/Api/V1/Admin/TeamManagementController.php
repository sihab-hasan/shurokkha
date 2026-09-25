<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeamManagementController extends Controller
{
    /**
     * Fetch assignments using direct SQL with INNER JOIN across team_management, rescue_teams, and emergency_requests.
     */
    public function index(): JsonResponse
    {
        $assignments = DB::select(<<<'SQL'
            SELECT 
                tm.assignment_id,
                tm.team_id,
                tm.request_id,
                tm.status,
                tm.assignment_at,
                tm.created_at,
                rt.team_name,
                rt.team_type,
                rt.availability AS team_availability,
                er.priority AS request_priority,
                er.status AS request_status,
                er.type AS request_type,
                u.full_name AS citizen_name,
                u.phone AS citizen_phone
            FROM team_management tm
            INNER JOIN rescue_teams rt ON tm.team_id = rt.team_id
            INNER JOIN emergency_requests er ON tm.request_id = er.request_id
            LEFT JOIN users u ON er.user_id = u.user_id
            ORDER BY tm.assignment_at DESC
        SQL);

        return response()->json(['data' => $assignments]);
    }

    /**
     * Store a new assignment using direct SQL INSERT.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'team_id' => 'required|integer|exists:rescue_teams,team_id',
            'request_id' => 'required|integer|exists:emergency_requests,request_id',
            'status' => 'required|string|max:50',
        ]);

        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO team_management (team_id, request_id, status, assignment_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        SQL, [
            $validated['team_id'],
            $validated['request_id'],
            $validated['status'],
            $now,
            $now,
            $now,
        ]);

        $insertedId = DB::getPdo()->lastInsertId();

        $assignment = DB::selectOne(<<<'SQL'
            SELECT 
                tm.assignment_id,
                tm.team_id,
                tm.request_id,
                tm.status,
                tm.assignment_at,
                rt.team_name,
                rt.team_type,
                er.priority AS request_priority,
                er.status AS request_status
            FROM team_management tm
            INNER JOIN rescue_teams rt ON tm.team_id = rt.team_id
            INNER JOIN emergency_requests er ON tm.request_id = er.request_id
            WHERE tm.assignment_id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $assignment], 201);
    }

    /**
     * Update assignment status using direct SQL UPDATE.
     */
    public function updateStatus(Request $request, int|string $assignment): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|max:50',
        ]);

        $assignmentId = is_numeric($assignment) ? (int) $assignment : 0;

        DB::update(<<<'SQL'
            UPDATE team_management
            SET status = ?, updated_at = ?
            WHERE assignment_id = ?
        SQL, [
            $validated['status'],
            now(),
            $assignmentId,
        ]);

        $updated = DB::selectOne(<<<'SQL'
            SELECT 
                tm.assignment_id,
                tm.team_id,
                tm.request_id,
                tm.status,
                tm.assignment_at,
                rt.team_name,
                rt.team_type,
                er.priority AS request_priority,
                er.status AS request_status
            FROM team_management tm
            INNER JOIN rescue_teams rt ON tm.team_id = rt.team_id
            INNER JOIN emergency_requests er ON tm.request_id = er.request_id
            WHERE tm.assignment_id = ?
        SQL, [$assignmentId]);

        return response()->json(['data' => $updated]);
    }

    /**
     * Delete assignment using direct SQL DELETE.
     */
    public function destroy(int|string $assignment): JsonResponse
    {
        $assignmentId = is_numeric($assignment) ? (int) $assignment : 0;

        DB::delete(<<<'SQL'
            DELETE FROM team_management
            WHERE assignment_id = ?
        SQL, [$assignmentId]);

        return response()->json(null, 204);
    }
}
