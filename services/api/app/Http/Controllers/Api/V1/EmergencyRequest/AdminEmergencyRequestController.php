<?php

namespace App\Http\Controllers\Api\V1\EmergencyRequest;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminEmergencyRequestController extends Controller
{
    /**
     * List all emergency requests with citizen contact and assignment counts.
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $priority = $request->query('priority');
        $type = $request->query('type');
        $disasterId = $request->query('disaster_id');

        $query = DB::table('emergency_requests as er')
            ->leftJoin('users as u', function ($join): void {
                $join->on('er.user_id', '=', 'u.id')
                    ->orOn('er.user_id', '=', 'u.user_id');
            })
            ->leftJoin('affected_areas as aa', 'er.area_id', '=', 'aa.area_id')
            ->select([
                'er.request_id',
                'er.user_id',
                'er.area_id',
                'er.type',
                'er.priority',
                'er.status',
                'er.description',
                'er.affected_people_count',
                'er.contact_phone',
                'er.address',
                'er.request_at',
                'er.submitted_at',
                'er.created_at',
                'er.updated_at',
                'u.name as citizen_name',
                'u.phone as citizen_phone',
                'u.email as citizen_email',
                'aa.area_name',
                'aa.severity as area_severity',
                'aa.disaster_id',
            ]);

        if (! empty($status)) {
            $query->where('er.status', $status);
        }

        if (! empty($priority)) {
            $query->where('er.priority', $priority);
        }

        if (! empty($type)) {
            $query->where('er.type', $type);
        }

        if (! empty($disasterId) && is_numeric($disasterId)) {
            $query->where('aa.disaster_id', (int) $disasterId);
        }

        $records = $query->orderByDesc('er.created_at')->get();

        return response()->json([
            'data' => $records,
        ]);
    }

    /**
     * Show a single emergency request with assigned teams.
     */
    public function show(int|string $emergencyRequest): JsonResponse
    {
        $requestId = is_numeric($emergencyRequest) ? (int) $emergencyRequest : 0;

        $record = DB::table('emergency_requests as er')
            ->leftJoin('users as u', function ($join): void {
                $join->on('er.user_id', '=', 'u.id')
                    ->orOn('er.user_id', '=', 'u.user_id');
            })
            ->leftJoin('affected_areas as aa', 'er.area_id', '=', 'aa.area_id')
            ->where('er.request_id', $requestId)
            ->select([
                'er.request_id',
                'er.user_id',
                'er.area_id',
                'er.type',
                'er.priority',
                'er.status',
                'er.description',
                'er.affected_people_count',
                'er.contact_phone',
                'er.address',
                'er.request_at',
                'er.submitted_at',
                'er.created_at',
                'er.updated_at',
                'u.name as citizen_name',
                'u.phone as citizen_phone',
                'u.email as citizen_email',
                'aa.area_name',
                'aa.disaster_id',
            ])
            ->first();

        if (! $record) {
            return response()->json(['message' => 'Emergency request not found.'], 404);
        }

        $assignments = DB::table('team_management as tm')
            ->leftJoin('rescue_teams as rt', 'tm.team_id', '=', 'rt.team_id')
            ->where('tm.request_id', $requestId)
            ->select([
                'tm.assignment_id',
                'tm.team_id',
                'tm.request_id',
                'tm.status',
                'tm.assigned_at',
                'tm.completed_at',
                'rt.team_name',
                'rt.team_type',
                'rt.availability',
            ])
            ->get();

        return response()->json([
            'data' => $record,
            'assignments' => $assignments,
        ]);
    }

    /**
     * Update emergency request fields.
     */
    public function update(Request $request, int|string $emergencyRequest): JsonResponse
    {
        $requestId = is_numeric($emergencyRequest) ? (int) $emergencyRequest : 0;

        $validated = $request->validate([
            'type' => 'nullable|string|max:50',
            'priority' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $updates = array_filter($validated, fn ($val) => $val !== null);
        $updates['updated_at'] = now();

        DB::table('emergency_requests')
            ->where('request_id', $requestId)
            ->update($updates);

        $updated = DB::table('emergency_requests')
            ->where('request_id', $requestId)
            ->first();

        return response()->json([
            'data' => $updated,
        ]);
    }

    /**
     * Delete an emergency request.
     */
    public function destroy(int|string $emergencyRequest): JsonResponse
    {
        $requestId = is_numeric($emergencyRequest) ? (int) $emergencyRequest : 0;

        DB::table('emergency_requests')
            ->where('request_id', $requestId)
            ->delete();

        return response()->json(null, 204);
    }
}
