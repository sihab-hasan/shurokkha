<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicAffectedAreaResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Public affected-area endpoints.
 *
 * Affected areas are the geographic unit connecting disasters ↔ shelters
 * ↔ emergency requests. Surfacing them publicly lets `/map` and the home
 * page paint a single "where is the response happening" map without
 * needing authorization.
 */
class PublicAffectedAreaController extends Controller
{
    public function index(): JsonResponse
    {
        $rows = DB::select(<<<'SQL'
            SELECT
                aa.area_id,
                aa.disaster_id,
                d.disaster_name,
                aa.affected_population,
                aa.severity
            FROM affected_areas aa
            LEFT JOIN disasters d ON aa.disaster_id = d.disaster_id
            ORDER BY
              CASE aa.severity
                WHEN 'Critical' THEN 1
                WHEN 'High' THEN 2
                WHEN 'Medium' THEN 3
                WHEN 'Low' THEN 4
                ELSE 5
              END,
              aa.affected_population DESC
        SQL);

        return response()->json([
            'data' => PublicAffectedAreaResource::collection(collect($rows))->resolve(),
        ]);
    }
}
