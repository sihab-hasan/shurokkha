<?php

namespace App\Http\Controllers\Api\V1\Alert;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Alert\StoreAlertRequest;
use App\Http\Requests\Api\V1\Alert\UpdateAlertRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Admin CRUD over alerts. Public reads are served by PublicAlertController.
 */
class AdminAlertController extends Controller
{
    public function index(): JsonResponse
    {
        $alerts = DB::select(<<<'SQL'
            SELECT
                a.alert_id, a.disaster_id, a.title, a.message, a.severity, a.status,
                a.area_description, a.latitude, a.longitude, a.issued_by,
                a.issued_at, a.expires_at, a.created_at, a.updated_at,
                d.disaster_name
            FROM alerts a
            LEFT JOIN disasters d ON a.disaster_id = d.disaster_id
            ORDER BY a.issued_at DESC
        SQL);

        return response()->json(['data' => $alerts]);
    }

    public function show(int|string $alert): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                a.*, d.disaster_name
            FROM alerts a
            LEFT JOIN disasters d ON a.disaster_id = d.disaster_id
            WHERE a.alert_id = ?
        SQL, [(int) $alert]);

        if (! $row) {
            return response()->json(['message' => 'Alert not found.'], 404);
        }

        return response()->json(['data' => $row]);
    }

    public function store(StoreAlertRequest $request): JsonResponse
    {
        $v = $request->validated();
        $user = $request->user();
        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO alerts
                (disaster_id, title, message, severity, status, area_description,
                 latitude, longitude, issued_by, issued_at, expires_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        SQL, [
            $v['disaster_id'] ?? null,
            $v['title'],
            $v['message'],
            $v['severity'] ?? 'info',
            $v['status'] ?? 'active',
            $v['area_description'] ?? null,
            $v['latitude'] ?? null,
            $v['longitude'] ?? null,
            $user?->id,
            $now,
            $v['expires_at'] ?? null,
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();

        return $this->respondWithRow($id, 201);
    }

    public function update(UpdateAlertRequest $request, int|string $alert): JsonResponse
    {
        $alertId = (int) $alert;
        $v = $request->validated();

        $existing = DB::selectOne('SELECT alert_id FROM alerts WHERE alert_id = ?', [$alertId]);
        if (! $existing) {
            return response()->json(['message' => 'Alert not found.'], 404);
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
            $bindings[] = $alertId;
            $sql = 'UPDATE alerts SET ' . implode(', ', $sets) . ' WHERE alert_id = ?';
            DB::update($sql, $bindings);
        }

        return $this->respondWithRow($alertId);
    }

    public function destroy(int|string $alert): JsonResponse
    {
        DB::delete('DELETE FROM alerts WHERE alert_id = ?', [(int) $alert]);

        return response()->json(null, 204);
    }

    /**
     * Internal helper used by store/update to echo the canonical row shape.
     */
    private function respondWithRow(int|string $id, int $status = 200): JsonResponse
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT
                a.*, d.disaster_name
            FROM alerts a
            LEFT JOIN disasters d ON a.disaster_id = d.disaster_id
            WHERE a.alert_id = ?
        SQL, [(int) $id]);

        return response()->json(['data' => $row], $status);
    }
}
