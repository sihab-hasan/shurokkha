<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class JoinReportController extends Controller
{
    /**
     * 1. INNER JOIN: Retrieve assignments details by joining team_management, rescue_teams, and emergency_requests.
     * Shows only active matches where a team is successfully assigned to a request.
     */
    public function innerJoin(): JsonResponse
    {
        $data = DB::select(<<<'SQL'
            SELECT 
                tm.assignment_id,
                rt.team_name,
                rt.team_type,
                er.request_id,
                er.priority AS request_priority,
                er.status AS request_status,
                tm.status AS assignment_status,
                tm.assignment_at
            FROM team_management tm
            INNER JOIN rescue_teams rt ON tm.team_id = rt.team_id
            INNER JOIN emergency_requests er ON tm.request_id = er.request_id
            ORDER BY tm.assignment_at DESC
        SQL);

        return response()->json(['data' => $data]);
    }

    /**
     * 2. LEFT JOIN: Retrieve all rescue teams and their assignments.
     * Includes teams that have NOT been assigned to any emergency requests yet (shows NULL values).
     */
    public function leftJoin(): JsonResponse
    {
        $data = DB::select(<<<'SQL'
            SELECT 
                rt.team_id,
                rt.team_name,
                rt.team_type,
                rt.availability,
                tm.assignment_id,
                tm.status AS assignment_status
            FROM rescue_teams rt
            LEFT JOIN team_management tm ON rt.team_id = tm.team_id
            ORDER BY rt.team_id ASC
        SQL);

        return response()->json(['data' => $data]);
    }

    /**
     * 3. RIGHT JOIN: Retrieve all affected areas and any corresponding emergency requests that occurred in them.
     * Includes affected areas that do NOT have any emergency requests yet.
     */
    public function rightJoin(): JsonResponse
    {
        $data = DB::select(<<<'SQL'
            SELECT 
                er.request_id,
                er.priority AS request_priority,
                er.status AS request_status,
                aa.area_id,
                aa.severity AS area_severity,
                aa.affected_population
            FROM emergency_requests er
            RIGHT JOIN affected_areas aa ON er.area_id = aa.area_id
            ORDER BY aa.area_id ASC
        SQL);

        return response()->json(['data' => $data]);
    }

    /**
     * 4. FULL OUTER JOIN (Simulated in MySQL using UNION of LEFT and RIGHT JOIN).
     * Demonstrates complete outer matching between rescue teams and team assignments.
     */
    public function fullOuterJoin(): JsonResponse
    {
        $data = DB::select(<<<'SQL'
            SELECT 
                rt.team_id,
                rt.team_name,
                tm.assignment_id,
                tm.status AS assignment_status
            FROM rescue_teams rt
            LEFT JOIN team_management tm ON rt.team_id = tm.team_id

            UNION

            SELECT 
                rt.team_id,
                rt.team_name,
                tm.assignment_id,
                tm.status AS assignment_status
            FROM rescue_teams rt
            RIGHT JOIN team_management tm ON rt.team_id = tm.team_id
        SQL);

        return response()->json(['data' => $data]);
    }

    /**
     * 5. UNION: Combine Shelters and Warehouses into one unified Facilities list.
     *
     * Both branches produce the same number of columns in the same order:
     *   facility_id | facility_name | facility_type | facility_status | total_capacity | area_reference
     */
    public function facilityLocations(): JsonResponse
    {
        $data = DB::select(<<<'SQL'
            SELECT
                s.shelter_id    AS facility_id,
                s.shelter_name  AS facility_name,
                'shelter'       AS facility_type,
                s.status        AS facility_status,
                s.capacity      AS total_capacity,
                s.area_id       AS area_reference
            FROM shelters s

            UNION ALL

            SELECT
                w.warehouse_id                          AS facility_id,
                w.warehouse_name                        AS facility_name,
                'warehouse'                             AS facility_type,
                'active'                                AS facility_status,
                COALESCE(SUM(wr.quantity), 0)           AS total_capacity,
                w.location_id                           AS area_reference
            FROM warehouses w
            LEFT JOIN warehouse_resources wr ON w.warehouse_id = wr.warehouse_id
            GROUP BY w.warehouse_id, w.warehouse_name, w.location_id

            ORDER BY facility_type ASC, facility_name ASC
        SQL);

        return response()->json(['data' => $data]);
    }
}
