<?php

namespace App\Http\Controllers\Api\V1\Appeal;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Appeal\ReviewAppealRequest;
use App\Http\Requests\Api\V1\Appeal\StoreAppealRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin endpoints for reviewing citizen appeals. Citizens submit at
 * /v1/auth/me/appeals.
 */
class AdminAppealController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');

        $sql = <<<'SQL'
            SELECT
                a.appeal_id, a.user_id, a.subject_type, a.subject_id,
                a.reason, a.status, a.reviewed_by, a.reviewed_at,
                a.decision_notes, a.created_at, a.updated_at,
                u.full_name AS user_name, u.email AS user_email,
                r.full_name AS reviewer_name
            FROM appeals a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN users r ON a.reviewed_by = r.id
            SQL;

        $bindings = [];
        if (is_string($status) && $status !== '') {
            $sql .= ' WHERE a.status = ?';
            $bindings[] = $status;
        }

        $sql .= ' ORDER BY a.created_at DESC';

        return response()->json(['data' => DB::select($sql, $bindings)]);
    }

    public function show(int|string $appeal): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                a.*, u.full_name AS user_name, u.email AS user_email,
                r.full_name AS reviewer_name
            FROM appeals a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN users r ON a.reviewed_by = r.id
            WHERE a.appeal_id = ?
        SQL, [(int) $appeal]);

        if (! $row) {
            return response()->json(['message' => 'Appeal not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }

    /**
     * Citizen view: list the authenticated user's own appeals.
     */
    public function indexMine(Request $request): JsonResponse
    {
        $userId = auth()->id();

        $rows = DB::select(<<<'SQL'
            SELECT
                a.*, r.full_name AS reviewer_name
            FROM appeals a
            LEFT JOIN users r ON a.reviewed_by = r.id
            WHERE a.user_id = ?
            ORDER BY a.created_at DESC
        SQL, [$userId]);

        return response()->json(['data' => $rows]);
    }

    public function store(StoreAppealRequest $request): JsonResponse
    {
        $v = $request->validated();
        $userId = auth()->id();
        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO appeals
                (user_id, subject_type, subject_id, reason, status,
                 created_at, updated_at)
            VALUES (?, ?, ?, ?, 'pending', ?, ?)
        SQL, [
            $userId,
            $v['subject_type'],
            $v['subject_id'],
            $v['reason'],
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();
        $row = DB::selectOne('SELECT * FROM appeals WHERE appeal_id = ?', [$id]);

        return response()->json(['data' => $row], 201);
    }

    public function review(ReviewAppealRequest $request, int|string $appeal): JsonResponse
    {
        $appealId = (int) $appeal;
        $v = $request->validated();
        $userId = auth()->id();
        $now = now();

        $existing = DB::selectOne('SELECT appeal_id FROM appeals WHERE appeal_id = ?', [$appealId]);
        if (! $existing) {
            return response()->json(['message' => 'Appeal not found.'], 404);
        }

        DB::update(<<<'SQL'
            UPDATE appeals SET
                status = ?,
                reviewed_by = ?,
                reviewed_at = ?,
                decision_notes = ?,
                updated_at = ?
            WHERE appeal_id = ?
        SQL, [
            $v['status'],
            $userId,
            $now,
            $v['decision_notes'] ?? null,
            $now,
            $appealId,
        ]);

        return $this->show($appealId);
    }

    public function destroy(int|string $appeal): JsonResponse
    {
        DB::delete('DELETE FROM appeals WHERE appeal_id = ?', [(int) $appeal]);

        return response()->json(null, 204);
    }
}
