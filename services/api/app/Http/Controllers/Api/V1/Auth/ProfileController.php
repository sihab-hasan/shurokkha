<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Requests\Auth\UploadAvatarRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Return the current user's profile. If preference rows don't exist
     * yet (legacy user pre-migration), lazy-create them so subsequent
     * sub-resource calls don't 404.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ensure preference rows exist
        $this->ensureNotificationPreference($user->id);
        $this->ensurePrivacyPreference($user->id);

        $profile = DB::selectOne(<<<'SQL'
            SELECT
                u.id,
                u.user_id,
                u.name,
                u.full_name,
                u.email,
                u.email_verified_at,
                u.phone,
                u.phone_verified_at,
                u.bio,
                u.avatar_path,
                u.status,
                u.timezone,
                u.two_factor_confirmed_at,
                u.created_at,
                u.updated_at
            FROM users u
            WHERE u.id = ?
        SQL, [$user->id]);

        return response()->json(['data' => $profile]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        // Belt-and-braces: strip fields that are not user-editable even if a
        // client tries to send them.
        $data = $request->validated();
        unset($data['role'], $data['password'], $data['avatar_path']);

        if (empty($data)) {
            return $this->show($request);
        }

        // Re-verify the email address whenever the user changes it.
        $emailChanged = array_key_exists('email', $data) && $data['email'] !== $user->email;

        $sets = [];
        $params = [];
        foreach ($data as $key => $value) {
            $sets[] = "{$key} = ?";
            $params[] = $value;
        }

        if ($emailChanged) {
            $sets[] = 'email_verified_at = NULL';
        }

        $sets[] = 'updated_at = ?';
        $params[] = now();
        $params[] = $user->id;

        $setClause = implode(', ', $sets);

        DB::update("UPDATE users SET {$setClause} WHERE id = ?", $params);

        $updated = DB::selectOne(<<<'SQL'
            SELECT
                id, user_id, name, full_name, email, email_verified_at,
                phone, phone_verified_at, bio, avatar_path, status,
                timezone, two_factor_confirmed_at, created_at, updated_at
            FROM users WHERE id = ?
        SQL, [$user->id]);

        return response()->json(['data' => $updated]);
    }

    public function uploadAvatar(UploadAvatarRequest $request): JsonResponse
    {
        $user = $request->user();

        // Delete old avatar if present
        $existing = DB::selectOne(<<<'SQL'
            SELECT avatar_path FROM users WHERE id = ?
        SQL, [$user->id]);

        if ($existing && $existing->avatar_path) {
            Storage::disk('local')->delete($existing->avatar_path);
        }

        $path = $request->file('avatar')->store('avatars', 'local');
        $now = now();

        DB::update(<<<'SQL'
            UPDATE users SET avatar_path = ?, updated_at = ? WHERE id = ?
        SQL, [$path, $now, $user->id]);

        $updated = DB::selectOne(<<<'SQL'
            SELECT
                id, user_id, name, full_name, email, email_verified_at,
                phone, phone_verified_at, bio, avatar_path, status,
                timezone, two_factor_confirmed_at, created_at, updated_at
            FROM users WHERE id = ?
        SQL, [$user->id]);

        return response()->json(['data' => $updated]);
    }

    public function destroyAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        $existing = DB::selectOne(<<<'SQL'
            SELECT avatar_path FROM users WHERE id = ?
        SQL, [$user->id]);

        if ($existing && $existing->avatar_path) {
            Storage::disk('local')->delete($existing->avatar_path);
            $now = now();

            DB::update(<<<'SQL'
                UPDATE users SET avatar_path = NULL, updated_at = ? WHERE id = ?
            SQL, [$now, $user->id]);
        }

        $updated = DB::selectOne(<<<'SQL'
            SELECT
                id, user_id, name, full_name, email, email_verified_at,
                phone, phone_verified_at, bio, avatar_path, status,
                timezone, two_factor_confirmed_at, created_at, updated_at
            FROM users WHERE id = ?
        SQL, [$user->id]);

        return response()->json(['data' => $updated]);
    }

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $user = $request->user();
        $now = now();

        // Hash the password manually since we are bypassing Eloquent's `hashed` cast.
        $hashed = Hash::make($request->validated('password'));

        DB::update(<<<'SQL'
            UPDATE users SET password = ?, updated_at = ? WHERE id = ?
        SQL, [$hashed, $now, $user->id]);

        // Best-effort: invalidate other sessions of this user. The current
        // session is left intact so the user is not kicked out of their
        // own browser mid-save.
        $currentSessionHash = $request->session()->getId()
            ? hash('sha256', $request->session()->getId())
            : null;

        if ($currentSessionHash) {
            DB::delete(<<<'SQL'
                DELETE FROM sessions
                WHERE user_id = ? AND id != ?
            SQL, [$user->id, $currentSessionHash]);
        } else {
            DB::delete(<<<'SQL'
                DELETE FROM sessions WHERE user_id = ?
            SQL, [$user->id]);
        }

        return response()->json([
            'message' => 'Password updated. Other sessions have been signed out.',
        ]);
    }

    private function ensureNotificationPreference(int $userId): void
    {
        $exists = DB::selectOne(<<<'SQL'
            SELECT id FROM notification_preferences WHERE user_id = ?
        SQL, [$userId]);

        if ($exists === null) {
            $now = now();
            DB::insert(<<<'SQL'
                INSERT INTO notification_preferences (user_id, created_at, updated_at)
                VALUES (?, ?, ?)
            SQL, [$userId, $now, $now]);
        }
    }

    private function ensurePrivacyPreference(int $userId): void
    {
        $exists = DB::selectOne(<<<'SQL'
            SELECT id FROM privacy_preferences WHERE user_id = ?
        SQL, [$userId]);

        if ($exists === null) {
            $now = now();
            DB::insert(<<<'SQL'
                INSERT INTO privacy_preferences (user_id, created_at, updated_at)
                VALUES (?, ?, ?)
            SQL, [$userId, $now, $now]);
        }
    }
}