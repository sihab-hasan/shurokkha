<?php

namespace App\Http\Controllers\Api\V1\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminWarehouseController extends Controller
{
    /**
     * Fetch all warehouses with manager user details via raw SQL LEFT JOIN.
     */
    public function index(): JsonResponse
    {
        $warehouses = DB::select(<<<'SQL'
            SELECT 
                w.warehouse_id,
                w.warehouse_name,
                w.location_id,
                w.manager_id,
                w.created_at,
                w.updated_at,
                u.full_name AS manager_name,
                u.email AS manager_email
            FROM warehouses w
            LEFT JOIN users u ON w.manager_id = u.user_id
            ORDER BY w.warehouse_id ASC
        SQL);

        return response()->json(['data' => $warehouses]);
    }

    /**
     * Store new warehouse via raw SQL INSERT.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'warehouse_name' => 'required|string|max:150',
            'location_id' => 'nullable|integer',
            'manager_id' => 'nullable|integer|exists:users,user_id',
        ]);

        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO warehouses (warehouse_name, location_id, manager_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        SQL, [
            $validated['warehouse_name'],
            $validated['location_id'] ?? null,
            $validated['manager_id'] ?? null,
            $now,
            $now,
        ]);

        $insertedId = DB::getPdo()->lastInsertId();

        $warehouse = DB::selectOne(<<<'SQL'
            SELECT 
                w.warehouse_id,
                w.warehouse_name,
                w.location_id,
                w.manager_id,
                w.created_at,
                u.full_name AS manager_name
            FROM warehouses w
            LEFT JOIN users u ON w.manager_id = u.user_id
            WHERE w.warehouse_id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $warehouse], 201);
    }

    /**
     * Delete warehouse via raw SQL DELETE.
     */
    public function destroy(int|string $warehouse): JsonResponse
    {
        $warehouseId = is_numeric($warehouse) ? (int) $warehouse : 0;

        DB::delete(<<<'SQL'
            DELETE FROM warehouses
            WHERE warehouse_id = ?
        SQL, [$warehouseId]);

        return response()->json(null, 204);
    }
}
