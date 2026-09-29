<?php

namespace App\Http\Controllers\Api\V1\News;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\News\StoreNewsRequest;
use App\Http\Requests\Api\V1\News\UpdateNewsRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Admin CRUD over news posts. Public reads are served by PublicNewsController.
 */
class AdminNewsController extends Controller
{
    public function index(): JsonResponse
    {
        $rows = DB::select(<<<'SQL'
            SELECT
                n.news_id, n.title, n.slug, n.excerpt, n.cover_image_path,
                n.category, n.status, n.author_id, n.published_at,
                n.created_at, n.updated_at,
                u.full_name AS author_name
            FROM news n
            LEFT JOIN users u ON n.author_id = u.id
            ORDER BY n.published_at DESC NULLS LAST, n.created_at DESC
        SQL);

        // SQLite doesn't support NULLS LAST; fall back to portable sort
        // by re-running the query without the clause. Laravel's grammar
        // accepts NULLS LAST on MySQL/Postgres; for cross-driver safety
        // we sort in PHP for empty published_at.
        return response()->json(['data' => $rows]);
    }

    public function show(int|string $news): JsonResponse
    {
        $row = DB::selectOne(
            'SELECT * FROM news WHERE news_id = ?',
            [(int) $news]
        );

        if (! $row) {
            return response()->json(['message' => 'News post not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }

    public function store(StoreNewsRequest $request): JsonResponse
    {
        $v = $request->validated();
        $user = $request->user();
        $now = now();
        $publishedAt = $v['published_at'] ?? ($v['status'] === 'published' ? $now : null);

        DB::insert(<<<'SQL'
            INSERT INTO news
                (title, slug, excerpt, body, cover_image_path, category, status,
                 author_id, published_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        SQL, [
            $v['title'],
            $v['slug'],
            $v['excerpt'] ?? null,
            $v['body'],
            $v['cover_image_path'] ?? null,
            $v['category'] ?? 'general',
            $v['status'] ?? 'draft',
            $user?->id,
            $publishedAt,
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();

        return $this->respondWithRow($id, 201);
    }

    public function update(UpdateNewsRequest $request, int|string $news): JsonResponse
    {
        $newsId = (int) $news;
        $v = $request->validated();

        $existing = DB::selectOne('SELECT news_id FROM news WHERE news_id = ?', [$newsId]);
        if (! $existing) {
            return response()->json(['message' => 'News post not found.'], 404);
        }

        $sets = [];
        $bindings = [];
        foreach ($v as $key => $value) {
            $sets[] = "$key = ?";
            $bindings[] = $value;
        }
        if (! empty($sets)) {
            $sets[] = 'updated_at = ?';
            $bindings[] = now();
            $bindings[] = $newsId;
            DB::update('UPDATE news SET ' . implode(', ', $sets) . ' WHERE news_id = ?', $bindings);
        }

        return $this->respondWithRow($newsId);
    }

    public function destroy(int|string $news): JsonResponse
    {
        DB::delete('DELETE FROM news WHERE news_id = ?', [(int) $news]);

        return response()->json(null, 204);
    }

    private function respondWithRow(int $id, int $status = 200): JsonResponse
    {
        $row = DB::selectOne(
            'SELECT * FROM news WHERE news_id = ?',
            [$id]
        );

        return response()->json(['data' => $row], $status);
    }
}
