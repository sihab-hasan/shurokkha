<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdateNotificationPreferenceRequest;
use App\Http\Resources\NotificationPreferenceResource;
use App\Models\NotificationPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class NotificationPreferenceController extends Controller
{
    public function show(Request $request): NotificationPreferenceResource
    {
        $user = $request->user();
        $preference = NotificationPreference::firstOrCreate(['user_id' => $user->id]);

        Gate::authorize('view', $preference);

        return new NotificationPreferenceResource($preference);
    }

    public function update(UpdateNotificationPreferenceRequest $request): NotificationPreferenceResource
    {
        $user = $request->user();
        $preference = NotificationPreference::firstOrCreate(['user_id' => $user->id]);

        Gate::authorize('update', $preference);

        $data = $request->validated();
        $preferences = $data['preferences'] ?? null;
        unset($data['preferences']);

        if ($preferences !== null) {
            $data['preferences_json'] = $preferences;
        }

        $preference->update($data);

        return new NotificationPreferenceResource($preference->refresh());
    }
}