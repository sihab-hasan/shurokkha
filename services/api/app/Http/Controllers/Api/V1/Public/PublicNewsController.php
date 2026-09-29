<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Public reads over news. Only `published` posts are visible.
 */
class PublicNewsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');
        $limit = min(50, max(1, (int) $request->query('limit', 20)));

        $sql = <<<'SQL'
            SELECT
                n.news_id, n.title, n.slug, n.excerpt, n.cover_image_path,
                n.category, n.published_at,
                u.full_name AS author_name
            FROM news n
            LEFT JOIN users u ON n.author_id = u.id
            WHERE n.status = 'published'
            SQL;

        $bindings = [];
        if (is_string($category) && $category !== '') {
            $sql .= ' AND n.category = ?';
            $bindings[] = $category;
        }

        $sql .= " ORDER BY n.published_at DESC LIMIT $limit";

        return response()->json(['data' => DB::select($sql, $bindings)]);
    }

    public function show(string $slug): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                n.news_id, n.title, n.slug, n.excerpt, n.body, n.cover_image_path,
                n.category, n.published_at,
                u.full_name AS author_name
            FROM news n
            LEFT JOIN users u ON n.author_id = u.id
            WHERE n.slug = ? AND n.status = 'published'
        SQL, [$slug]);

        if (! $row) {
            return response()->json(['message' => 'News post not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }
}
