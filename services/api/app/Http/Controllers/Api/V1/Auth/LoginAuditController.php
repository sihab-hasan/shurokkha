<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoginAuditResource;
use App\Models\LoginAudit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

        $records = LoginAudit::query()
            ->where('user_id', $user->id)
            ->orderByDesc('signed_in_at')
            ->limit($limit)
            ->get();

        $currentSessionHash = $request->session()->getId()
            ? hash('sha256', $request->session()->getId())
            : null;

        $data = $records->map(function (LoginAudit $audit) use ($currentSessionHash): array {
            $item = (new LoginAuditResource($audit))->toArray($request);
            $item['is_current_session'] = $currentSessionHash !== null
                && $audit->session_token_hash === $currentSessionHash;
            return $item;
        })->values();

        return response()->json(['data' => $data]);
    }
}