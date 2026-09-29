<?php

namespace App\Http\Controllers\Api\V1\Feedback;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Feedback\RespondFeedbackRequest;
use App\Http\Requests\Api\V1\Feedback\StoreFeedbackRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin CRUD over feedback. Citizens submit at /v1/auth/me/feedback.
 */
class AdminFeedbackController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');

        $sql = <<<'SQL'
            SELECT
                f.feedback_id, f.subject, f.message, f.rating, f.category, f.status,
                f.reviewed_by, f.reviewed_at, f.response,
                f.created_at, f.updated_at,
                u.full_name AS user_name, u.email AS user_email,
                r.full_name AS reviewer_name
            FROM feedback f
            LEFT JOIN users u ON f.user_id = u.id
            LEFT JOIN users r ON f.reviewed_by = r.id
            SQL;

        $bindings = [];
        if (is_string($status) && $status !== '') {
            $sql .= ' WHERE f.status = ?';
            $bindings[] = $status;
        }

        $sql .= ' ORDER BY f.created_at DESC';

        return response()->json(['data' => DB::select($sql, $bindings)]);
    }

    public function show(int|string $feedback): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                f.*, u.full_name AS user_name, u.email AS user_email,
                r.full_name AS reviewer_name
            FROM feedback f
            LEFT JOIN users u ON f.user_id = u.id
            LEFT JOIN users r ON f.reviewed_by = r.id
            WHERE f.feedback_id = ?
        SQL, [(int) $feedback]);

        if (! $row) {
            return response()->json(['message' => 'Feedback not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }

    /**
     * Citizen view: list the authenticated user's own feedback.
     */
    public function indexMine(Request $request): JsonResponse
    {
        $userId = auth()->id();

        $rows = DB::select(<<<'SQL'
            SELECT
                f.*, r.full_name AS reviewer_name
            FROM feedback f
            LEFT JOIN users r ON f.reviewed_by = r.id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
        SQL, [$userId]);

        return response()->json(['data' => $rows]);
    }

    public function store(StoreFeedbackRequest $request): JsonResponse
    {
        $v = $request->validated();
        $userId = auth()->id();
        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO feedback
                (user_id, subject, message, rating, category, status,
                 created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
        SQL, [
            $userId,
            $v['subject'],
            $v['message'],
            $v['rating'] ?? null,
            $v['category'],
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();
        $row = DB::selectOne('SELECT * FROM feedback WHERE feedback_id = ?', [$id]);

        return response()->json(['data' => $row], 201);
    }

    public function respond(RespondFeedbackRequest $request, int|string $feedback): JsonResponse
    {
        $feedbackId = (int) $feedback;
        $v = $request->validated();
        $userId = auth()->id();
        $now = now();

        $existing = DB::selectOne('SELECT feedback_id FROM feedback WHERE feedback_id = ?', [$feedbackId]);
        if (! $existing) {
            return response()->json(['message' => 'Feedback not found.'], 404);
        }

        DB::update(<<<'SQL'
            UPDATE feedback SET
                response = ?,
                status = ?,
                reviewed_by = ?,
                reviewed_at = ?,
                updated_at = ?
            WHERE feedback_id = ?
        SQL, [
            $v['response'],
            $v['status'] ?? 'reviewed',
            $userId,
            $now,
            $now,
            $feedbackId,
        ]);

        return $this->show($feedbackId);
    }

    public function destroy(int|string $feedback): JsonResponse
    {
        DB::delete('DELETE FROM feedback WHERE feedback_id = ?', [(int) $feedback]);

        return response()->json(null, 204);
    }
}
