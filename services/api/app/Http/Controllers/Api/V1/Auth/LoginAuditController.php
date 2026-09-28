<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoginAuditController extends Controller
{
    /**
     * Return the last N login audits for the authenticated user (most
     * recent first). The current session is flagged in the response so
     * the UI can mark it as "This device".
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $limit = (int) min(50, max(1, $request->query('limit', 20)));

        $currentSessionHash = $request->session()->getId()
            ? hash('sha256', $request->session()->getId())
            : null;

        $records = DB::select(<<<'SQL'
            SELECT
                id,
                user_id,
                ip_address,
                user_agent,
                session_token_hash,
                successful,
                failure_reason,
                signed_in_at,
                signed_out_at,
                created_at
            FROM login_audits
            WHERE user_id = ?
            ORDER BY signed_in_at DESC
            LIMIT ?
        SQL, [$user->id, $limit]);

        $data = array_map(function (object $audit) use ($currentSessionHash): object {
            $audit->is_current_session = $currentSessionHash !== null
                && $audit->session_token_hash === $currentSessionHash;
            return $audit;
        }, $records);

        return response()->json(['data' => $data]);
    }
}