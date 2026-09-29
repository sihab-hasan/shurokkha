<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Public, guest-accessible reads over alerts.
 *
 * Returns only currently-active alerts (status='active' and not yet expired)
 * by default; an `?include=expired` flag surfaces historical entries for
 * transparency.
 */
class PublicAlertController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $includeExpired = $request->boolean('include_expired');
        $bindings = [];

        $sql = <<<'SQL'
            SELECT
                a.alert_id, a.disaster_id, a.title, a.message, a.severity, a.status,
                a.area_description, a.latitude, a.longitude, a.issued_at, a.expires_at,
                d.disaster_name
            FROM alerts a
            LEFT JOIN disasters d ON a.disaster_id = d.disaster_id
            SQL;

        if (! $includeExpired) {
            $sql .= ' WHERE a.status = ? AND (a.expires_at IS NULL OR a.expires_at > ?)';
            $bindings[] = 'active';
            $bindings[] = now();
        }

        $sql .= ' ORDER BY a.issued_at DESC LIMIT 100';

        return response()->json(['data' => DB::select($sql, $bindings)]);
    }

    public function show(int|string $alert): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                a.alert_id, a.disaster_id, a.title, a.message, a.severity, a.status,
                a.area_description, a.latitude, a.longitude, a.issued_at, a.expires_at,
                d.disaster_name
            FROM alerts a
            LEFT JOIN disasters d ON a.disaster_id = d.disaster_id
            WHERE a.alert_id = ?
        SQL, [(int) $alert]);

        if (! $row) {
            return response()->json(['message' => 'Alert not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }
}
