<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdateNotificationPreferenceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationPreferenceController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $preference = $this->findOrCreatePreference($user->id);

        return response()->json(['data' => $preference]);
    }

    public function update(UpdateNotificationPreferenceRequest $request): JsonResponse
    {
        $user = $request->user();

        $this->findOrCreatePreference($user->id);

        $validated = $request->validated();

        // The form request exposes `preferences` but the table column is
        // `preferences_json`. Remap before building the dynamic SET clause.
        $preferences = $validated['preferences'] ?? null;
        unset($validated['preferences']);
        if ($preferences !== null) {
            $validated['preferences_json'] = json_encode($preferences);
        }

        $sets = [];
        $params = [];
        foreach ($validated as $key => $value) {
            $sets[] = "{$key} = ?";
            $params[] = $value;
        }
        $sets[] = 'updated_at = ?';
        $params[] = now();
        $params[] = $user->id;

        $setClause = implode(', ', $sets);

        DB::update("UPDATE notification_preferences SET {$setClause} WHERE user_id = ?", $params);

        $updated = DB::selectOne(<<<'SQL'
            SELECT * FROM notification_preferences WHERE user_id = ?
        SQL, [$user->id]);

        return response()->json(['data' => $updated]);
    }

    /**
     * Fetch the preference row for a user, creating a default row if none exists.
     */
    private function findOrCreatePreference(int $userId): object
    {
        $row = DB::selectOne(<<<'SQL'
            SELECT * FROM notification_preferences WHERE user_id = ?
        SQL, [$userId]);

        if ($row !== null) {
            return $row;
        }

        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO notification_preferences (user_id, created_at, updated_at)
            VALUES (?, ?, ?)
        SQL, [$userId, $now, $now]);

        return DB::selectOne(<<<'SQL'
            SELECT * FROM notification_preferences WHERE user_id = ?
        SQL, [$userId]);
    }
}