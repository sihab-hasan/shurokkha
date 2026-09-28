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

    /**
     * TRANSACTION: Atomically dispatch relief supplies from a warehouse.
     *
     * Executes inside a single DB::transaction():
     *   1. Pessimistic row write-lock (FOR UPDATE)
     *   2. Inventory sufficiency check
     *   3. Deduct from warehouse_resources
     *   4. INSERT into relief_distributions
     *   5. INSERT into distribution_resources
     */
    public function distributeRelief(Request $request, int|string $warehouse): JsonResponse
    {
        $warehouseId = is_numeric($warehouse) ? (int) $warehouse : 0;

        $validated = $request->validate([
            'area_id'     => 'required|integer|exists:affected_areas,area_id',
            'shelter_id'  => 'nullable|integer|exists:shelters,shelter_id',
            'resource_id' => 'required|integer|exists:resources,resource_id',
            'quantity'    => 'required|numeric|min:0.01',
        ]);

        $resourceId = (int) $validated['resource_id'];
        $quantity   = (float) $validated['quantity'];
        $areaId     = (int) $validated['area_id'];
        $shelterId  = isset($validated['shelter_id']) ? (int) $validated['shelter_id'] : null;

        try {
            $result = DB::transaction(function () use ($warehouseId, $areaId, $shelterId, $resourceId, $quantity) {
                // Step 1: Pessimistic read-lock
                $stock = DB::selectOne(<<<'SQL'
                    SELECT quantity
                    FROM   warehouse_resources
                    WHERE  warehouse_id = ? AND resource_id = ?
                    FOR UPDATE
                SQL, [$warehouseId, $resourceId]);

                if (! $stock || (float) $stock->quantity < $quantity) {
                    throw new \RuntimeException(
                        'Insufficient warehouse stock for the requested relief distribution.'
                    );
                }

                // Step 2: Deduct inventory
                DB::update(<<<'SQL'
                    UPDATE warehouse_resources
                    SET    quantity = quantity - ?
                    WHERE  warehouse_id = ? AND resource_id = ?
                SQL, [$quantity, $warehouseId, $resourceId]);

                // Step 3: Insert master distribution record
                DB::insert(<<<'SQL'
                    INSERT INTO relief_distributions
                        (shelter_id, area_id, distribution_date, status, created_at, updated_at)
                    VALUES
                        (?, ?, NOW(), 'dispatched', NOW(), NOW())
                SQL, [$shelterId, $areaId]);

                $distributionId = (int) DB::getPdo()->lastInsertId();

                // Step 4: Insert line-item record
                DB::insert(<<<'SQL'
                    INSERT INTO distribution_resources
                        (distribution_id, resource_id, quantity_distributed, created_at, updated_at)
                    VALUES
                        (?, ?, ?, NOW(), NOW())
                SQL, [$distributionId, $resourceId, $quantity]);

                $updatedStock = DB::selectOne(<<<'SQL'
                    SELECT quantity
                    FROM   warehouse_resources
                    WHERE  warehouse_id = ? AND resource_id = ?
                SQL, [$warehouseId, $resourceId]);

                return [
                    'distribution_id'   => $distributionId,
                    'warehouse_id'      => $warehouseId,
                    'resource_id'       => $resourceId,
                    'quantity_deducted' => $quantity,
                    'remaining_stock'   => (float) $updatedStock->quantity,
                    'status'            => 'dispatched',
                ];
            });

            return response()->json([
                'message' => 'Relief supplies distributed successfully via atomic transaction.',
                'data'    => $result,
            ], 201);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Transaction failed and all changes were rolled back.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
