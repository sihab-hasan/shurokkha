<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Requests\Auth\UploadAvatarRequest;
use App\Http\Resources\ProfileResource;
use App\Models\NotificationPreference;
use App\Models\PrivacyPreference;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Return the current user's profile. If preference rows don't exist
     * yet (legacy user pre-migration), lazy-create them so subsequent
     * sub-resource calls don't 404.
     */
    public function show(Request $request): ProfileResource
    {
        $user = $request->user();

        Gate::authorize('view', $user);

        NotificationPreference::firstOrCreate(['user_id' => $user->id]);
        PrivacyPreference::firstOrCreate(['user_id' => $user->id]);

        return new ProfileResource($user);
    }

    public function update(UpdateProfileRequest $request): ProfileResource
    {
        $user = $request->user();

        Gate::authorize('update', $user);

        // Belt-and-braces: strip fields that are not user-editable even if a
        // client tries to send them.
        $data = $request->validated();
        unset($data['role'], $data['password'], $data['avatar_path']);

        $originalEmail = $user->email;

        DB::transaction(function () use ($user, $data, $originalEmail): void {
            $user->fill($data);

            // Re-verify the email address whenever the user changes it.
            if (array_key_exists('email', $data) && $data['email'] !== $originalEmail) {
                $user->email_verified_at = null;
            }

            $user->save();
        });

        return new ProfileResource($user->refresh());
    }

    public function uploadAvatar(UploadAvatarRequest $request): ProfileResource
    {
        $user = $request->user();

        Gate::authorize('update', $user);

        if ($user->avatar_path) {
            Storage::disk('local')->delete($user->avatar_path);
        }

        $path = $request->file('avatar')->store('avatars', 'local');

        $user->update(['avatar_path' => $path]);

        return new ProfileResource($user->refresh());
    }

    public function destroyAvatar(Request $request): ProfileResource
    {
        $user = $request->user();

        Gate::authorize('update', $user);

        if ($user->avatar_path) {
            Storage::disk('local')->delete($user->avatar_path);
            $user->update(['avatar_path' => null]);
        }

        return new ProfileResource($user->refresh());
    }

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        Gate::authorize('update', $user);

        // Update the password via the model so the `hashed` cast hashes it.
        $user->update([
            'password' => $request->validated('password'),
        ]);

        // Best-effort: invalidate other sessions of this user. The current
        // session is left intact so the user is not kicked out of their
        // own browser mid-save.
        $currentSessionHash = $request->session()->getId()
            ? hash('sha256', $request->session()->getId())
            : null;

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->when($currentSessionHash, function ($query, string $hash): void {
                $query->where('id', '!=', $hash);
            })
            ->delete();

        return response()->json([
            'message' => 'Password updated. Other sessions have been signed out.',
        ]);
    }
}