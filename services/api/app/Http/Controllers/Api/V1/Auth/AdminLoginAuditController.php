<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin-only: view the platform-wide login audit log.
 *
 *   GET /v1/admin/login-audits         — list, filterable by user_id / successful, ordered desc
 *   GET /v1/admin/login-audits/{id}    — single audit row
 *
 * Returns raw stdClass rows (not Resources) to keep parity with the
 * project's other admin list endpoints that use raw SQL.
 */
class AdminLoginAuditController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->query('user_id');
        $successful = $request->query('successful');
        $limit = (int) $request->query('limit', 50);
        $limit = max(1, min(200, $limit));

        $sql = <<<'SQL'
            SELECT
                la.id, la.user_id, la.ip_address, la.user_agent,
                la.session_token_hash, la.successful, la.failure_reason,
                la.signed_in_at, la.signed_out_at, la.created_at,
                u.full_name AS user_name, u.email AS user_email
            FROM login_audits la
            LEFT JOIN users u ON la.user_id = u.id
        SQL;

        $bindings = [];
        $where = [];
        if (is_string($userId) && $userId !== '') {
            $where[] = 'la.user_id = ?';
            $bindings[] = (int) $userId;
        }
        if (is_string($successful) && $successful !== '') {
            $where[] = 'la.successful = ?';
            $bindings[] = $successful === 'true' || $successful === '1' ? 1 : 0;
        }
        if (! empty($where)) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY la.created_at DESC LIMIT ' . $limit;

        return response()->json(['data' => DB::select($sql, $bindings)]);
    }

    public function show(int|string $audit): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                la.id, la.user_id, la.ip_address, la.user_agent,
                la.session_token_hash, la.successful, la.failure_reason,
                la.signed_in_at, la.signed_out_at, la.created_at,
                u.full_name AS user_name, u.email AS user_email
            FROM login_audits la
            LEFT JOIN users u ON la.user_id = u.id
            WHERE la.id = ?
        SQL, [(int) $audit]);

        if (! $row) {
            return response()->json(['message' => 'Audit record not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }
}
