<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AffectedArea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AffectedAreaController extends Controller
{
    public function index(): JsonResponse
    {
        $areas = AffectedArea::latest()->get();
        return response()->json(['data' => $areas]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'disaster_id' => 'required|integer',
            'location_id' => 'required|integer',
            'affected_population' => 'required|integer|min:0',
            'severity' => 'required|string|max:50',
        ]);

        $area = AffectedArea::create($validated);
        return response()->json(['data' => $area], 201);
    }

    public function destroy(AffectedArea $affectedArea): JsonResponse
    {
        $affectedArea->delete();
        return response()->json(null, 204);
    }
}
