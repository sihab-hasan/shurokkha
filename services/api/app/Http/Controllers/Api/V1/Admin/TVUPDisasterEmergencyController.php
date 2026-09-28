<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TVUPDisasterEmergencyController extends Controller
{
   
    public function getUserEmergencyHistory(): JsonResponse
    {
        $data = DB::select('SELECT * FROM view_user_emergency_history');
        
        return response()->json([
            'operation' => 'VIEW',
            'data' => $data
        ]);
    }

    /**
     * Unified Critical Alerts Feed combining Disasters and Emergencies
     */
    public function getCriticalAlerts(): JsonResponse
    {
        // Executes the UNION query directly
        $data = DB::select(<<<'SQL'
            SELECT 
                CONCAT('REQ-', request_id) AS alert_id,
                'Citizen Emergency' AS alert_type,
                priority AS alert_severity,
                request_at AS alert_time,
                status AS current_status
            FROM emergency_requests
            WHERE priority = 'critical'
            
            UNION ALL
            
            SELECT 
                CONCAT('DIS-', disaster_id) AS alert_id,
                'National Disaster' AS alert_type,
                severity AS alert_severity,
                start_datetime AS alert_time,
                status AS current_status
            FROM disasters
            WHERE severity IN ('severe', 'critical', 'high')
            
            ORDER BY alert_time DESC
        SQL);

        return response()->json([
            'operation' => 'UNION',
            'data' => $data
        ]);
    }

    /**
     * Escalate disaster severity and related pending requests
     */
    public function escalateDisaster(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'disaster_id' => 'required|integer',
            'new_severity' => 'required|string',
        ]);

        // Calls the Stored Procedure created in TVUP_Disaster_Emergency.sql
        DB::statement('CALL sp_escalate_disaster_and_requests(?, ?)', [
            $validated['disaster_id'],
            $validated['new_severity']
        ]);

        return response()->json([
            'operation' => 'STORED PROCEDURE',
            'message' => "Successfully executed procedure to escalate disaster ID {$validated['disaster_id']} to {$validated['new_severity']}."
        ]);
    }

    /**
     * Atomic Disaster & Emergency Reporting
     */
    public function reportDisasterAndEmergency(Request $request): JsonResponse
    {
        $userId = $request->user()->id ?? 1; // Assuming a user is logged in
        $now = now();

        // Start Transaction
        DB::beginTransaction();

        try {
            // Step 1: Create Disaster
            DB::insert(<<<'SQL'
                INSERT INTO disasters (disaster_name, severity, status, start_datetime, created_at, updated_at)
                VALUES (?, 'high', 'active', ?, ?, ?)
            SQL, [
                $request->input('disaster_name', 'Sudden Flash Flood Sylhet'),
                $now, $now, $now
            ]);
            
            $disasterId = DB::getPdo()->lastInsertId();

            // Step 2: Create Affected Area linked to Disaster
            DB::insert(<<<'SQL'
                INSERT INTO affected_areas (disaster_id, affected_population, severity, created_at, updated_at)
                VALUES (?, 5000, 'high', ?, ?)
            SQL, [$disasterId, $now, $now]);
            
            $areaId = DB::getPdo()->lastInsertId();

            // Step 3: Create Emergency Request linked to Area and User
            DB::insert(<<<'SQL'
                INSERT INTO emergency_requests (user_id, area_id, type, priority, status, request_at, created_at, updated_at)
                VALUES (?, ?, 'rescue', 'high', 'pending', ?, ?, ?)
            SQL, [$userId, $areaId, $now, $now, $now]);

            // If all 3 inserts succeed, commit to database
            DB::commit();

            return response()->json([
                'operation' => 'TRANSACTION',
                'status' => 'SUCCESS',
                'message' => 'Disaster, Area, and Emergency request successfully saved together.',
                'new_disaster_id' => $disasterId,
                'new_area_id' => $areaId
            ], 201);
            
        } catch (\Exception $e) {
            // If any insert fails, rollback everything
            DB::rollBack();
            
            return response()->json([
                'operation' => 'TRANSACTION',
                'status' => 'FAILED (ROLLED BACK)',
                'message' => 'An error occurred. No data was saved.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
