<?php

namespace App\Http\Controllers\Api\V1\Fundraise;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Fundraise\StoreFundraiseRequest;
use App\Http\Requests\Api\V1\Fundraise\UpdateFundraiseRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Admin CRUD over fundraise campaigns. Public reads are served by
 * PublicFundraiseController.
 */
class AdminFundraiseController extends Controller
{
    public function index(): JsonResponse
    {
        $rows = DB::select(<<<'SQL'
            SELECT
                f.fundraise_id, f.title, f.slug, f.summary, f.cover_image_path,
                f.goal_amount, f.raised_amount, f.currency, f.status,
                f.starts_at, f.ends_at, f.beneficiary_name, f.created_at, f.updated_at,
                u.full_name AS organizer_name
            FROM fundraises f
            LEFT JOIN users u ON f.organizer_id = u.id
            ORDER BY f.created_at DESC
        SQL);

        return response()->json(['data' => $rows]);
    }

    public function show(int|string $fundraise): JsonResponse
    {
        $row = DB::selectOne('SELECT * FROM fundraises WHERE fundraise_id = ?', [(int) $fundraise]);

        if (! $row) {
            return response()->json(['message' => 'Fundraise not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }

    public function store(StoreFundraiseRequest $request): JsonResponse
    {
        $v = $request->validated();
        $user = $request->user();
        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO fundraises
                (title, slug, summary, description, cover_image_path,
                 goal_amount, raised_amount, currency, status,
                 starts_at, ends_at, organizer_id, beneficiary_name,
                 created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        SQL, [
            $v['title'],
            $v['slug'],
            $v['summary'] ?? null,
            $v['description'],
            $v['cover_image_path'] ?? null,
            $v['goal_amount'],
            $v['raised_amount'] ?? 0,
            $v['currency'] ?? 'BDT',
            $v['status'] ?? 'active',
            $v['starts_at'] ?? null,
            $v['ends_at'] ?? null,
            $user?->id,
            $v['beneficiary_name'] ?? null,
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();

        return $this->respondWithRow($id, 201);
    }

    public function update(UpdateFundraiseRequest $request, int|string $fundraise): JsonResponse
    {
        $fundraiseId = (int) $fundraise;
        $v = $request->validated();

        $existing = DB::selectOne('SELECT fundraise_id FROM fundraises WHERE fundraise_id = ?', [$fundraiseId]);
        if (! $existing) {
            return response()->json(['message' => 'Fundraise not found.'], 404);
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
            $bindings[] = $fundraiseId;
            DB::update('UPDATE fundraises SET ' . implode(', ', $sets) . ' WHERE fundraise_id = ?', $bindings);
        }

        return $this->respondWithRow($fundraiseId);
    }

    public function destroy(int|string $fundraise): JsonResponse
    {
        DB::delete('DELETE FROM fundraises WHERE fundraise_id = ?', [(int) $fundraise]);

        return response()->json(null, 204);
    }

    private function respondWithRow(int $id, int $status = 200): JsonResponse
    {
        $row = DB::selectOne('SELECT * FROM fundraises WHERE fundraise_id = ?', [$id]);

        return response()->json(['data' => $row], $status);
    }
}
