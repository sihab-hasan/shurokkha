<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Public reads over fundraise campaigns. Only `active` campaigns are
 * surfaced by default; `?status=` overrides.
 */
class PublicFundraiseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status', 'active');
        $limit = min(50, max(1, (int) $request->query('limit', 20)));

        $sql = <<<'SQL'
            SELECT
                f.fundraise_id, f.title, f.slug, f.summary, f.cover_image_path,
                f.goal_amount, f.raised_amount, f.currency, f.status,
                f.starts_at, f.ends_at, f.beneficiary_name,
                u.full_name AS organizer_name
            FROM fundraises f
            LEFT JOIN users u ON f.organizer_id = u.id
            WHERE f.status = ?
            ORDER BY f.created_at DESC
            LIMIT ?
        SQL;

        return response()->json(['data' => DB::select($sql, [$status, $limit])]);
    }

    public function show(string $slug): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                f.fundraise_id, f.title, f.slug, f.summary, f.description, f.cover_image_path,
                f.goal_amount, f.raised_amount, f.currency, f.status,
                f.starts_at, f.ends_at, f.beneficiary_name,
                u.full_name AS organizer_name
            FROM fundraises f
            LEFT JOIN users u ON f.organizer_id = u.id
            WHERE f.slug = ? AND f.status = 'active'
        SQL, [$slug]);

        if (! $row) {
            return response()->json(['message' => 'Fundraise not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }
}
