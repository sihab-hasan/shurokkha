<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function index(): JsonResponse
    {
        $warehouses = Warehouse::latest()->get();

        return response()->json(['data' => $warehouses]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'warehouse_name' => 'required|string|max:150',
            'location_id' => 'nullable|integer',
            'manager_id' => 'nullable|integer|exists:users,id',
        ]);

        $warehouse = Warehouse::create($validated);

        return response()->json(['data' => $warehouse], 201);
    }

    public function destroy(Warehouse $warehouse): JsonResponse
    {
        $warehouse->delete();

        return response()->json(null, 204);
    }
}
