<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicShelterResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Public shelter endpoints.
 *
 * Mirrors {@see \App\Http\Controllers\Api\V1\Shelter\AdminShelterController}
 * but accepts no writes and lives outside the `auth` group so guests
 * can browse `/shelters` and `/map`.
 *
 * Filtering:
 *   - `?status=open|full|closed`  (whitelisted)
 *   - `?only_available=1`         (boolean — hides shelters at capacity)
 *
 * Sort: status priority (open → full → closed), then name.
 */
class PublicShelterController extends Controller
{
    private const ALLOWED_STATUSES = ['open', 'full', 'closed'];

    public function index(Request $request): JsonResponse
    {
        $status = $this->normalizeStatus($request->query('status'));
        $onlyAvailable = filter_var(
            $request->query('only_available'),
            FILTER_VALIDATE_BOOLEAN
        );

        $rows = DB::select(<<<'SQL'
            SELECT
                s.shelter_id,
                s.area_id,
                s.shelter_name,
                s.capacity,
                s.occupancy,
                s.status,
                aa.severity AS area_severity
            FROM shelters s
            LEFT JOIN affected_areas aa ON s.area_id = aa.area_id
            WHERE (? IS NULL OR s.status = ?)
              AND (? = 0 OR s.occupancy < s.capacity)
            ORDER BY
              CASE s.status
                WHEN 'open' THEN 1
                WHEN 'full' THEN 2
                WHEN 'closed' THEN 3
                ELSE 4
              END,
              s.shelter_name ASC
        SQL, [$status, $status, $onlyAvailable ? 1 : 0]);

        return response()->json([
            'data' => PublicShelterResource::collection(collect($rows))->resolve(),
            'meta' => [
                'statuses' => self::ALLOWED_STATUSES,
            ],
        ]);
    }

    public function show(int $shelter): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                s.shelter_id,
                s.area_id,
                s.shelter_name,
                s.capacity,
                s.occupancy,
                s.status,
                aa.severity AS area_severity
            FROM shelters s
            LEFT JOIN affected_areas aa ON s.area_id = aa.area_id
            WHERE s.shelter_id = ?
        SQL, [$shelter]);

        if ($row === null) {
            return response()->json(['message' => 'Shelter not found.'], 404);
        }

        return response()->json([
            'data' => (new PublicShelterResource($row))->resolve(),
        ]);
    }

    private function normalizeStatus(mixed $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        return in_array($value, self::ALLOWED_STATUSES, true) ? $value : null;
    }
}
