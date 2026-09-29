<?php

namespace App\Http\Controllers\Api\V1\Volunteer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Volunteer\ReviewVolunteerRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin endpoints for volunteer applications.
 *
 *   GET    /v1/admin/volunteers                  — list applications
 *   GET    /v1/admin/volunteers/{volunteer}      — show one
 *   PATCH  /v1/admin/volunteers/{volunteer}/review — approve / reject
 *   DELETE /v1/admin/volunteers/{volunteer}      — hard delete
 */
class AdminVolunteerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');

        $sql = <<<'SQL'
            SELECT
                v.volunteer_id, v.user_id, v.full_name, v.phone, v.email,
                v.address, v.skills, v.availability, v.motivation,
                v.status, v.reviewed_by, v.reviewed_at, v.review_notes,
                v.created_at, v.updated_at,
                u.full_name AS user_full_name,
                r.full_name AS reviewer_name
            FROM volunteers v
            LEFT JOIN users u ON v.user_id = u.id
            LEFT JOIN users r ON v.reviewed_by = r.id
            SQL;

        $bindings = [];
        if (is_string($status) && $status !== '') {
            $sql .= ' WHERE v.status = ?';
            $bindings[] = $status;
        }

        $sql .= ' ORDER BY v.created_at DESC';

        return response()->json(['data' => DB::select($sql, $bindings)]);
    }

    public function show(int|string $volunteer): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                v.*, u.full_name AS user_full_name, r.full_name AS reviewer_name
            FROM volunteers v
            LEFT JOIN users u ON v.user_id = u.id
            LEFT JOIN users r ON v.reviewed_by = r.id
            WHERE v.volunteer_id = ?
        SQL, [(int) $volunteer]);

        if (! $row) {
            return response()->json(['message' => 'Volunteer application not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }

    public function review(ReviewVolunteerRequest $request, int|string $volunteer): JsonResponse
    {
        $volunteerId = (int) $volunteer;
        $v = $request->validated();
        $user = $request->user();
        $now = now();

        $existing = DB::selectOne('SELECT volunteer_id FROM volunteers WHERE volunteer_id = ?', [$volunteerId]);
        if (! $existing) {
            return response()->json(['message' => 'Volunteer application not found.'], 404);
        }

        DB::update(<<<'SQL'
            UPDATE volunteers SET
                status = ?,
                reviewed_by = ?,
                reviewed_at = ?,
                review_notes = ?,
                updated_at = ?
            WHERE volunteer_id = ?
        SQL, [
            $v['status'],
            $user?->id,
            $now,
            $v['review_notes'] ?? null,
            $now,
            $volunteerId,
        ]);

        return $this->show($volunteerId);
    }

    public function destroy(int|string $volunteer): JsonResponse
    {
        DB::delete('DELETE FROM volunteers WHERE volunteer_id = ?', [(int) $volunteer]);

        return response()->json(null, 204);
    }
}
