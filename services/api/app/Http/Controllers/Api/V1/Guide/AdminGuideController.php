<?php

namespace App\Http\Controllers\Api\V1\Guide;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Guide\StoreGuideRequest;
use App\Http\Requests\Api\V1\Guide\UpdateGuideRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Admin CRUD over preparedness/during/after/legal guides. Public reads
 * are served by PublicGuideController.
 */
class AdminGuideController extends Controller
{
    public function index(): JsonResponse
    {
        $rows = DB::select(<<<'SQL'
            SELECT
                g.guide_id, g.title, g.slug, g.summary, g.cover_image_path,
                g.category, g.status, g.reading_time_minutes, g.author_id,
                g.published_at, g.created_at, g.updated_at,
                u.full_name AS author_name
            FROM guides g
            LEFT JOIN users u ON g.author_id = u.id
            ORDER BY g.published_at DESC, g.created_at DESC
        SQL);

        return response()->json(['data' => $rows]);
    }

    public function show(int|string $guide): JsonResponse
    {
        $row = DB::selectOne('SELECT * FROM guides WHERE guide_id = ?', [(int) $guide]);

        if (! $row) {
            return response()->json(['message' => 'Guide not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }

    public function store(StoreGuideRequest $request): JsonResponse
    {
        $v = $request->validated();
        $user = $request->user();
        $now = now();
        $publishedAt = $v['published_at'] ?? ($v['status'] === 'published' ? $now : null);

        DB::insert(<<<'SQL'
            INSERT INTO guides
                (title, slug, summary, body, category, cover_image_path, status,
                 reading_time_minutes, author_id, published_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        SQL, [
            $v['title'],
            $v['slug'],
            $v['summary'] ?? null,
            $v['body'],
            $v['category'] ?? 'preparedness',
            $v['cover_image_path'] ?? null,
            $v['status'] ?? 'draft',
            $v['reading_time_minutes'] ?? 5,
            $user?->id,
            $publishedAt,
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();

        return $this->respondWithRow($id, 201);
    }

    public function update(UpdateGuideRequest $request, int|string $guide): JsonResponse
    {
        $guideId = (int) $guide;
        $v = $request->validated();

        $existing = DB::selectOne('SELECT guide_id FROM guides WHERE guide_id = ?', [$guideId]);
        if (! $existing) {
            return response()->json(['message' => 'Guide not found.'], 404);
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
            $bindings[] = $guideId;
            DB::update('UPDATE guides SET ' . implode(', ', $sets) . ' WHERE guide_id = ?', $bindings);
        }

        return $this->respondWithRow($guideId);
    }

    public function destroy(int|string $guide): JsonResponse
    {
        DB::delete('DELETE FROM guides WHERE guide_id = ?', [(int) $guide]);

        return response()->json(null, 204);
    }

    private function respondWithRow(int $id, int $status = 200): JsonResponse
    {
        $row = DB::selectOne('SELECT * FROM guides WHERE guide_id = ?', [$id]);

        return response()->json(['data' => $row], $status);
    }
}
