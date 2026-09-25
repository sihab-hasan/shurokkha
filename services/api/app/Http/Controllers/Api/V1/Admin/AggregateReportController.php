<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AggregateReportController extends Controller
{
    /**
     * Overview Summary Metrics using COUNT, SUM, AVG.
     */
    public function summary(): JsonResponse
    {
        $disasterSummary = DB::selectOne(<<<'SQL'
            SELECT 
                COUNT(*) AS total_disasters,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_disasters
            FROM disasters
        SQL);

        $affectedAreaSummary = DB::selectOne(<<<'SQL'
            SELECT 
                COUNT(area_id) AS total_areas,
                COALESCE(SUM(affected_population), 0) AS total_affected_population,
                COALESCE(AVG(affected_population), 0) AS average_population_per_area
            FROM affected_areas
        SQL);

        $emergencyRequestSummary = DB::selectOne(<<<'SQL'
            SELECT 
                COUNT(request_id) AS total_requests,
                SUM(CASE WHEN priority = 'critical' THEN 1 ELSE 0 END) AS critical_requests,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_requests
            FROM emergency_requests
        SQL);

        $rescueTeamSummary = DB::selectOne(<<<'SQL'
            SELECT 
                COUNT(team_id) AS total_teams,
                SUM(CASE WHEN availability = 'available' THEN 1 ELSE 0 END) AS available_teams
            FROM rescue_teams
        SQL);

        $shelterSummary = DB::selectOne(<<<'SQL'
            SELECT 
                COUNT(shelter_id) AS total_shelters,
                COALESCE(SUM(capacity), 0) AS total_capacity,
                COALESCE(SUM(occupancy), 0) AS total_occupancy
            FROM shelters
        SQL);

        $donationSummary = DB::selectOne(<<<'SQL'
            SELECT 
                COUNT(donation_id) AS total_donations,
                COALESCE(SUM(amount), 0) AS total_donation_amount
            FROM donations
        SQL);

        return response()->json([
            'data' => [
                'disasters' => $disasterSummary,
                'affected_areas' => $affectedAreaSummary,
                'emergency_requests' => $emergencyRequestSummary,
                'rescue_teams' => $rescueTeamSummary,
                'shelters' => $shelterSummary,
                'donations' => $donationSummary,
            ]
        ]);
    }

    /**
     * 5. AGGREGATION & GROUP BY (COUNT, SUM, AVG)
     * Grouping affected areas by severity to count areas, sum population, and compute averages.
     */
    public function areaSeverityBreakdown(): JsonResponse
    {
        $data = DB::select(<<<'SQL'
            SELECT 
                severity,
                COUNT(area_id) AS total_affected_areas,
                COALESCE(SUM(affected_population), 0) AS total_population_affected,
                COALESCE(AVG(affected_population), 0) AS average_population_affected
            FROM affected_areas
            GROUP BY severity
            ORDER BY total_population_affected DESC
        SQL);

        return response()->json(['data' => $data]);
    }

    /**
     * 6. AGGREGATION, GROUP BY, and HAVING
     * Retrieve rescue teams and count their assignments, filtering for teams with >= 1 assignment.
     */
    public function activeRescueTeamAssignments(): JsonResponse
    {
        $data = DB::select(<<<'SQL'
            SELECT 
                rt.team_id,
                rt.team_name,
                rt.team_type,
                COUNT(tm.assignment_id) AS total_assignments
            FROM rescue_teams rt
            LEFT JOIN team_management tm ON rt.team_id = tm.team_id
            GROUP BY rt.team_id, rt.team_name, rt.team_type
            HAVING total_assignments >= 1
            ORDER BY total_assignments DESC
        SQL);

        return response()->json(['data' => $data]);
    }

    /**
     * Citizen Request Aggregation: Total, Critical, and Resolved requests by user.
     */
    public function citizenRequestStats(): JsonResponse
    {
        $data = DB::select(<<<'SQL'
            SELECT 
                u.user_id,
                u.full_name,
                u.phone,
                u.email,
                COUNT(er.request_id) AS total_requests,
                SUM(CASE WHEN er.priority = 'critical' THEN 1 ELSE 0 END) AS critical_requests,
                SUM(CASE WHEN er.status = 'rescued' OR er.status = 'completed' THEN 1 ELSE 0 END) AS resolved_requests,
                MAX(er.request_at) AS last_request_time
            FROM users u
            INNER JOIN emergency_requests er ON u.user_id = er.user_id
            GROUP BY u.user_id, u.full_name, u.phone, u.email
            ORDER BY total_requests DESC
        SQL);

        return response()->json(['data' => $data]);
    }
}
