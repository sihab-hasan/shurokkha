<?php

namespace App\Http\Controllers\Api\V1\Citizen;

use App\Http\Controllers\Controller;
use App\Http\Requests\Citizen\AssistanceRequest\ListAssistanceRequestsRequest;
use App\Http\Requests\Citizen\AssistanceRequest\StoreAssistanceRequest;
use App\Http\Requests\Citizen\AssistanceRequest\UpdateAssistanceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AssistanceRequestController extends Controller
{
    /**
     * 1. Fetch citizen requests using 100% Raw SQL INNER JOIN with users and LEFT JOIN with affected_areas.
     */
    public function index(ListAssistanceRequestsRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $userId  = $request->user()->user_id ?? $request->user()->id;
        $perPage = max(1, (int) ($validated['per_page'] ?? 10));
        $page    = max(1, (int) ($validated['page'] ?? 1));
        $offset  = ($page - 1) * $perPage;

        // Total count for pagination meta
        $countRow = DB::selectOne(
            'SELECT COUNT(*) AS total FROM emergency_requests er WHERE er.user_id = ? AND er.deleted_at IS NULL',
            [$userId]
        );
        $total    = (int) ($countRow->total ?? 0);
        $lastPage = max(1, (int) ceil($total / $perPage));

        $requests = DB::select(<<<SQL
            SELECT 
                er.request_id AS id,
                er.request_id,
                er.user_id,
                er.area_id,
                er.type,
                er.priority,
                er.description,
                er.affected_people_count,
                er.contact_phone,
                er.address,
                er.status,
                er.request_at,
                er.submitted_at,
                er.cancelled_at,
                er.resolved_at,
                er.created_at,
                er.updated_at,
                u.full_name AS citizen_name,
                u.phone     AS citizen_phone,
                aa.severity AS area_severity
            FROM emergency_requests er
            INNER JOIN users u ON er.user_id = u.user_id
            LEFT JOIN affected_areas aa ON er.area_id = aa.area_id
            WHERE er.user_id = ? AND er.deleted_at IS NULL
            ORDER BY er.created_at DESC
            LIMIT {$perPage} OFFSET {$offset}
        SQL, [$userId]);

        return response()->json([
            'data'  => $requests,
            'meta'  => [
                'total'        => $total,
                'per_page'     => $perPage,
                'current_page' => $page,
                'last_page'    => $lastPage,
            ],
            'links' => [
                'first' => null,
                'last'  => null,
                'prev'  => $page > 1 ? $page - 1 : null,
                'next'  => $page < $lastPage ? $page + 1 : null,
            ],
        ]);
    }

    /**
     * 2. Store new emergency request using 100% Raw SQL INSERT.
     */
    public function store(StoreAssistanceRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $userId = $request->user()->user_id ?? $request->user()->id;
        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO emergency_requests (
                user_id,
                area_id,
                type,
                priority,
                description,
                affected_people_count,
                contact_phone,
                address,
                status,
                request_at,
                submitted_at,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        SQL, [
            $userId,
            $validated['area_id'] ?? null,
            $validated['type'] ?? 'essentials',
            $validated['priority'] ?? 'normal',
            $validated['description'] ?? null,
            $validated['affected_people_count'] ?? 1,
            $validated['contact_phone'] ?? null,
            $validated['address'] ?? null,
            'submitted',
            $now,
            $now,
            $now,
            $now,
        ]);

        $insertedId = DB::getPdo()->lastInsertId();

        $created = DB::selectOne(<<<'SQL'
            SELECT 
                er.request_id AS id,
                er.request_id,
                er.user_id,
                er.area_id,
                er.type,
                er.priority,
                er.description,
                er.affected_people_count,
                er.contact_phone,
                er.address,
                er.status,
                er.submitted_at,
                er.created_at
            FROM emergency_requests er
            WHERE er.request_id = ?
        SQL, [$insertedId]);

        return response()->json(['data' => $created], 201);
    }

    /**
     * 3. Show single request details via 100% Raw SQL with Multi-table JOIN.
     */
    public function show(int|string $assistanceRequest): JsonResponse
    {
        $requestId = is_numeric($assistanceRequest) ? (int) $assistanceRequest : 0;
        $userId = auth()->id();

        $record = DB::selectOne(<<<'SQL'
            SELECT 
                er.request_id AS id,
                er.request_id,
                er.user_id,
                er.area_id,
                er.type,
                er.priority,
                er.description,
                er.affected_people_count,
                er.contact_phone,
                er.address,
                er.status,
                er.request_at,
                er.submitted_at,
                er.cancelled_at,
                er.resolved_at,
                er.created_at,
                er.updated_at,
                u.full_name AS citizen_name,
                u.phone AS citizen_phone,
                aa.severity AS area_severity
            FROM emergency_requests er
            INNER JOIN users u ON er.user_id = u.user_id
            LEFT JOIN affected_areas aa ON er.area_id = aa.area_id
            WHERE er.request_id = ? AND er.deleted_at IS NULL
        SQL, [$requestId]);

        if (! $record) {
            return response()->json(['message' => 'Request not found'], 404);
        }

        if ($record->user_id !== $userId && auth()->user()?->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(['data' => $record]);
    }

    /**
     * 4. Update request via 100% Raw SQL UPDATE.
     */
    public function update(UpdateAssistanceRequest $request, int|string $assistanceRequest): JsonResponse
    {
        $requestId = is_numeric($assistanceRequest) ? (int) $assistanceRequest : 0;
        $userId = auth()->id();
        $validated = $request->validated();

        $existing = DB::selectOne(<<<'SQL'
            SELECT status, user_id FROM emergency_requests WHERE request_id = ? AND deleted_at IS NULL
        SQL, [$requestId]);

        if (! $existing) {
            return response()->json(['message' => 'Request not found'], 404);
        }

        if ($existing->user_id !== $userId && auth()->user()?->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (in_array($existing->status, ['resolved', 'rejected', 'cancelled', 'rescued'], true)) {
            return response()->json(['message' => 'This request can no longer be changed.'], 409);
        }

        DB::update(<<<'SQL'
            UPDATE emergency_requests
            SET 
                description = COALESCE(?, description),
                affected_people_count = COALESCE(?, affected_people_count),
                contact_phone = COALESCE(?, contact_phone),
                address = COALESCE(?, address),
                updated_at = ?
            WHERE request_id = ?
        SQL, [
            $validated['description'] ?? null,
            $validated['affected_people_count'] ?? null,
            $validated['contact_phone'] ?? null,
            $validated['address'] ?? null,
            now(),
            $requestId,
        ]);

        $updated = DB::selectOne(<<<'SQL'
            SELECT * FROM emergency_requests WHERE request_id = ?
        SQL, [$requestId]);

        return response()->json(['data' => $updated]);
    }

    /**
     * 5. Delete request via 100% Raw SQL (Soft Delete).
     */
    public function destroy(int|string $assistanceRequest): JsonResponse
    {
        $requestId = is_numeric($assistanceRequest) ? (int) $assistanceRequest : 0;
        $userId = auth()->id();

        DB::update(<<<'SQL'
            UPDATE emergency_requests
            SET deleted_at = ?, updated_at = ?
            WHERE request_id = ? AND user_id = ?
        SQL, [now(), now(), $requestId, $userId]);

        return response()->json(null, 204);
    }

    /**
     * 6. Cancel request via 100% Raw SQL UPDATE.
     */
    public function cancel(int|string $assistanceRequest): JsonResponse
    {
        $requestId = is_numeric($assistanceRequest) ? (int) $assistanceRequest : 0;
        $userId = auth()->id();
        $now = now();

        $existing = DB::selectOne(<<<'SQL'
            SELECT status, user_id FROM emergency_requests WHERE request_id = ? AND deleted_at IS NULL
        SQL, [$requestId]);

        if (! $existing) {
            return response()->json(['message' => 'Request not found'], 404);
        }

        if ($existing->user_id !== $userId && auth()->user()?->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (in_array($existing->status, ['resolved', 'rejected', 'cancelled', 'rescued'], true)) {
            return response()->json(['message' => 'This request can no longer be changed.'], 409);
        }

        DB::update(<<<'SQL'
            UPDATE emergency_requests
            SET status = 'cancelled', cancelled_at = ?, updated_at = ?
            WHERE request_id = ?
        SQL, [$now, $now, $requestId]);

        $updated = DB::selectOne(<<<'SQL'
            SELECT * FROM emergency_requests WHERE request_id = ?
        SQL, [$requestId]);

        return response()->json(['data' => $updated]);
    }
}
