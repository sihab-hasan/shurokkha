<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shelter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShelterController extends Controller
{
    public function index(): JsonResponse
    {
        $shelters = Shelter::latest()->get();

        return response()->json(['data' => $shelters]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shelter_name' => 'required|string|max:150',
            'capacity' => 'required|integer|min:0',
            'occupancy' => 'required|integer|min:0',
            'area_id' => 'nullable|integer|exists:affected_areas,area_id',
            'status' => 'sometimes|string|max:50',
        ]);

        $shelter = Shelter::create($validated);

        return response()->json(['data' => $shelter], 201);
    }

    public function destroy(Shelter $shelter): JsonResponse
    {
        $shelter->delete();

        return response()->json(null, 204);
    }
}
