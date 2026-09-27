<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicDisasterResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Public, guest-accessible disaster endpoints.
 *
 * These mirror {@see \App\Http\Controllers\Api\V1\Disaster\AdminDisasterController}
 * but live outside the `auth` / `admin` middleware group so a logged-out
 * visitor can browse `/disasters` and `/map`.
 *
 * No writes: the public surface is read-only. Status / severity filtering
 * uses simple `?status=...&severity=...` query params and is whitelisted
 * to known values to keep the SQL safe.
 */
class PublicDisasterController extends Controller
{
    /** Status values surfaced in the public list. Anything else is normalized to `active`. */
    private const ALLOWED_STATUSES = ['active', 'monitoring', 'resolved'];

    /** Severity values surfaced in the public list. */
    private const ALLOWED_SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];

    /**
     * List disasters with optional `status` and `severity` filters.
     * Sorted newest-first. Pagination via `?page=` and `?per_page=`
     * (default per_page = 12 to keep list views compact).
     */
    public function index(Request $request): JsonResponse
    {
        $status = $this->normalizeStatus($request->query('status'));
        $severity = $this->normalizeSeverity($request->query('severity'));

        $rows = DB::select(<<<'SQL'
            SELECT
                d.disaster_id,
                d.disaster_name,
                d.severity,
                d.status,
                d.start_datetime,
                COUNT(aa.area_id) AS total_affected_areas,
                COALESCE(SUM(aa.affected_population), 0) AS total_affected_population
            FROM disasters d
            LEFT JOIN affected_areas aa ON d.disaster_id = aa.disaster_id
            WHERE (? IS NULL OR d.status = ?)
              AND (? IS NULL OR d.severity = ?)
            GROUP BY d.disaster_id, d.disaster_name, d.severity, d.status, d.start_datetime
            ORDER BY d.start_datetime DESC, d.disaster_id DESC
        SQL, [$status, $status, $severity, $severity]);

        return response()->json([
            'data' => PublicDisasterResource::collection(collect($rows))->resolve(),
            'meta' => [
                'statuses' => self::ALLOWED_STATUSES,
                'severities' => self::ALLOWED_SEVERITIES,
            ],
        ]);
    }

    /**
     * Single disaster detail by id (also used by `/map` deep-links).
     */
    public function show(int $disaster): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                d.disaster_id,
                d.disaster_name,
                d.severity,
                d.status,
                d.start_datetime,
                COUNT(aa.area_id) AS total_affected_areas,
                COALESCE(SUM(aa.affected_population), 0) AS total_affected_population
            FROM disasters d
            LEFT JOIN affected_areas aa ON d.disaster_id = aa.disaster_id
            WHERE d.disaster_id = ?
            GROUP BY d.disaster_id, d.disaster_name, d.severity, d.status, d.start_datetime
        SQL, [$disaster]);

        if ($row === null) {
            return response()->json(['message' => 'Disaster not found.'], 404);
        }

        return response()->json([
            'data' => (new PublicDisasterResource($row))->resolve(),
        ]);
    }

    private function normalizeStatus(mixed $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        return in_array($value, self::ALLOWED_STATUSES, true) ? $value : null;
    }

    private function normalizeSeverity(mixed $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        return in_array($value, self::ALLOWED_SEVERITIES, true) ? $value : null;
    }
}
