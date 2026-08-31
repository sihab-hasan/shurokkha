<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\RescueTeam;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RescueTeamController extends Controller
{
    public function index(): JsonResponse
    {
        $teams = RescueTeam::latest()->get();
        return response()->json(['data' => $teams]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'team_name' => 'required|string|max:100',
            'team_type' => 'required|string|max:50',
            'availability' => 'required|string|max:50',
        ]);

        $team = RescueTeam::create($validated);
        return response()->json(['data' => $team], 201);
    }

    public function destroy(RescueTeam $rescueTeam): JsonResponse
    {
        $rescueTeam->delete();
        return response()->json(null, 204);
    }
}
