<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Public reads over knowledge-base guides.
 */
class PublicGuideController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');
        $limit = min(50, max(1, (int) $request->query('limit', 20)));

        $sql = <<<'SQL'
            SELECT
                g.guide_id, g.title, g.slug, g.summary, g.cover_image_path,
                g.category, g.reading_time_minutes, g.published_at,
                u.full_name AS author_name
            FROM guides g
            LEFT JOIN users u ON g.author_id = u.id
            WHERE g.status = 'published'
            SQL;

        $bindings = [];
        if (is_string($category) && $category !== '') {
            $sql .= ' AND g.category = ?';
            $bindings[] = $category;
        }

        $sql .= " ORDER BY g.published_at DESC LIMIT $limit";

        return response()->json(['data' => DB::select($sql, $bindings)]);
    }

    public function show(string $slug): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                g.guide_id, g.title, g.slug, g.summary, g.body, g.cover_image_path,
                g.category, g.reading_time_minutes, g.published_at,
                u.full_name AS author_name
            FROM guides g
            LEFT JOIN users u ON g.author_id = u.id
            WHERE g.slug = ? AND g.status = 'published'
        SQL, [$slug]);

        if (! $row) {
            return response()->json(['message' => 'Guide not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }
}
