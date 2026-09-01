<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamManagement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamManagementController extends Controller
{
    public function index(): JsonResponse
    {
        $assignments = TeamManagement::latest()->get();

        return response()->json(['data' => $assignments]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'team_id' => 'required|integer|exists:rescue_teams,team_id',
            'request_id' => 'required|integer|exists:emergency_requests,request_id',
            'status' => 'required|string|max:50',
        ]);

        $assignment = TeamManagement::create([
            ...$validated,
            'assignment_at' => now(),
        ]);

        return response()->json(['data' => $assignment], 201);
    }

    public function updateStatus(Request $request, TeamManagement $assignment): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|max:50',
        ]);

        $assignment->update([
            'status' => $validated['status'],
        ]);

        return response()->json(['data' => $assignment->refresh()]);
    }

    public function destroy(TeamManagement $assignment): JsonResponse
    {
        $assignment->delete();

        return response()->json(null, 204);
    }
}
