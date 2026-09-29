<?php

namespace App\Http\Controllers\Api\V1\Complaint;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Complaint\ReviewComplaintRequest;
use App\Http\Requests\Api\V1\Complaint\StoreComplaintRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin CRUD over complaints. Citizens submit at /v1/auth/me/complaints.
 */
class AdminComplaintController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $sql = <<<'SQL'
            SELECT
                c.complaint_id, c.subject, c.description, c.category, c.status,
                c.reviewed_by, c.reviewed_at, c.resolution_notes,
                c.created_at, c.updated_at,
                u.full_name AS user_name, u.email AS user_email,
                r.full_name AS reviewer_name
            FROM complaints c
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN users r ON c.reviewed_by = r.id
            SQL;

        $bindings = [];
        if (is_string($status) && $status !== '') {
            $sql .= ' WHERE c.status = ?';
            $bindings[] = $status;
        }

        $sql .= ' ORDER BY c.created_at DESC';

        return response()->json(['data' => DB::select($sql, $bindings)]);
    }

    public function show(int|string $complaint): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                c.*, u.full_name AS user_name, u.email AS user_email,
                r.full_name AS reviewer_name
            FROM complaints c
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN users r ON c.reviewed_by = r.id
            WHERE c.complaint_id = ?
        SQL, [(int) $complaint]);

        if (! $row) {
            return response()->json(['message' => 'Complaint not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }

    /**
     * Citizen view: list the authenticated user's own complaints.
     */
    public function indexMine(Request $request): JsonResponse
    {
        $userId = auth()->id();

        $rows = DB::select(<<<'SQL'
            SELECT
                c.*, r.full_name AS reviewer_name
            FROM complaints c
            LEFT JOIN users r ON c.reviewed_by = r.id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
        SQL, [$userId]);

        return response()->json(['data' => $rows]);
    }

    public function store(StoreComplaintRequest $request): JsonResponse
    {
        $v = $request->validated();
        $userId = auth()->id();
        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO complaints
                (user_id, subject, description, category, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'pending', ?, ?)
        SQL, [
            $userId,
            $v['subject'],
            $v['description'],
            $v['category'],
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();
        $row = DB::selectOne('SELECT * FROM complaints WHERE complaint_id = ?', [$id]);

        return response()->json(['data' => $row], 201);
    }

    public function review(ReviewComplaintRequest $request, int|string $complaint): JsonResponse
    {
        $complaintId = (int) $complaint;
        $v = $request->validated();
        $userId = auth()->id();
        $now = now();

        $existing = DB::selectOne('SELECT complaint_id FROM complaints WHERE complaint_id = ?', [$complaintId]);
        if (! $existing) {
            return response()->json(['message' => 'Complaint not found.'], 404);
        }

        DB::update(<<<'SQL'
            UPDATE complaints SET
                status = ?,
                reviewed_by = ?,
                reviewed_at = ?,
                resolution_notes = ?,
                updated_at = ?
            WHERE complaint_id = ?
        SQL, [
            $v['status'],
            $userId,
            $now,
            $v['resolution_notes'] ?? null,
            $now,
            $complaintId,
        ]);

        return $this->show($complaintId);
    }

    public function destroy(int|string $complaint): JsonResponse
    {
        DB::delete('DELETE FROM complaints WHERE complaint_id = ?', [(int) $complaint]);

        return response()->json(null, 204);
    }
}
