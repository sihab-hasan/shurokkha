<?php

namespace App\Http\Controllers\Api\V1\HelpRequest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\HelpRequest\AssignHelpRequestRequest;
use App\Http\Requests\Api\V1\HelpRequest\StoreHelpRequestRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin CRUD over help requests. Citizens submit at /v1/auth/me/help-requests.
 */
class AdminHelpRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $priority = $request->query('priority');

        $sql = <<<'SQL'
            SELECT
                h.help_request_id, h.user_id, h.disaster_id, h.request_type, h.priority,
                h.description, h.affected_people_count, h.address, h.latitude, h.longitude,
                h.contact_phone, h.status, h.assigned_team_id, h.reviewed_by,
                h.reviewed_at, h.resolution_notes, h.created_at, h.updated_at,
                u.full_name AS user_name, u.phone AS user_phone,
                d.disaster_name,
                rt.team_name AS assigned_team_name
            FROM help_requests h
            LEFT JOIN users u ON h.user_id = u.id
            LEFT JOIN disasters d ON h.disaster_id = d.disaster_id
            LEFT JOIN rescue_teams rt ON h.assigned_team_id = rt.team_id
            SQL;

        $bindings = [];
        $where = [];
        if (is_string($status) && $status !== '') {
            $where[] = 'h.status = ?';
            $bindings[] = $status;
        }
        if (is_string($priority) && $priority !== '') {
            $where[] = 'h.priority = ?';
            $bindings[] = $priority;
        }
        if (! empty($where)) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }

        // MySQL has FIELD() but SQLite doesn't — use a portable CASE expression
        // so the same query runs in production (MySQL) and tests (SQLite).
        $sql .= <<<'SQL'
             ORDER BY
                CASE h.priority
                    WHEN 'critical' THEN 1
                    WHEN 'high'     THEN 2
                    WHEN 'normal'   THEN 3
                    WHEN 'low'      THEN 4
                    ELSE 5
                END,
                h.created_at DESC
        SQL;

        return response()->json(['data' => DB::select($sql, $bindings)]);
    }

    public function show(int|string $helpRequest): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                h.*, u.full_name AS user_name, u.phone AS user_phone,
                d.disaster_name, rt.team_name AS assigned_team_name
            FROM help_requests h
            LEFT JOIN users u ON h.user_id = u.id
            LEFT JOIN disasters d ON h.disaster_id = d.disaster_id
            LEFT JOIN rescue_teams rt ON h.assigned_team_id = rt.team_id
            WHERE h.help_request_id = ?
        SQL, [(int) $helpRequest]);

        if (! $row) {
            return response()->json(['message' => 'Help request not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }

    /**
     * Citizen view: list the authenticated user's own help requests.
     */
    public function indexMine(Request $request): JsonResponse
    {
        $userId = auth()->id();

        $rows = DB::select(<<<'SQL'
            SELECT
                h.*, d.disaster_name, rt.team_name AS assigned_team_name
            FROM help_requests h
            LEFT JOIN disasters d ON h.disaster_id = d.disaster_id
            LEFT JOIN rescue_teams rt ON h.assigned_team_id = rt.team_id
            WHERE h.user_id = ?
            ORDER BY h.created_at DESC
        SQL, [$userId]);

        return response()->json(['data' => $rows]);
    }

    public function store(StoreHelpRequestRequest $request): JsonResponse
    {
        $v = $request->validated();
        $userId = auth()->id();
        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO help_requests
                (user_id, disaster_id, request_type, priority, description,
                 affected_people_count, address, latitude, longitude, contact_phone,
                 status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
        SQL, [
            $userId,
            $v['disaster_id'] ?? null,
            $v['request_type'],
            $v['priority'],
            $v['description'],
            $v['affected_people_count'],
            $v['address'],
            $v['latitude'] ?? null,
            $v['longitude'] ?? null,
            $v['contact_phone'],
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();
        $row = DB::selectOne('SELECT * FROM help_requests WHERE help_request_id = ?', [$id]);

        return response()->json(['data' => $row], 201);
    }

    public function assign(AssignHelpRequestRequest $request, int|string $helpRequest): JsonResponse
    {
        $helpRequestId = (int) $helpRequest;
        $v = $request->validated();
        $userId = auth()->id();
        $now = now();

        $existing = DB::selectOne('SELECT help_request_id FROM help_requests WHERE help_request_id = ?', [$helpRequestId]);
        if (! $existing) {
            return response()->json(['message' => 'Help request not found.'], 404);
        }

        DB::update(<<<'SQL'
            UPDATE help_requests SET
                assigned_team_id = ?,
                status = 'assigned',
                reviewed_by = ?,
                reviewed_at = ?,
                updated_at = ?
            WHERE help_request_id = ?
        SQL, [
            $v['assigned_team_id'],
            $userId,
            $now,
            $now,
            $helpRequestId,
        ]);

        return $this->show($helpRequestId);
    }

    public function destroy(int|string $helpRequest): JsonResponse
    {
        DB::delete('DELETE FROM help_requests WHERE help_request_id = ?', [(int) $helpRequest]);

        return response()->json(null, 204);
    }
}
