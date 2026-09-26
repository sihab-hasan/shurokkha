<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdatePrivacyPreferenceRequest;
use App\Http\Resources\PrivacyPreferenceResource;
use App\Models\PrivacyPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PrivacyPreferenceController extends Controller
{
    public function show(Request $request): PrivacyPreferenceResource
    {
        $user = $request->user();
        $preference = PrivacyPreference::firstOrCreate(['user_id' => $user->id]);

        Gate::authorize('view', $preference);

        return new PrivacyPreferenceResource($preference);
    }

    public function update(UpdatePrivacyPreferenceRequest $request): PrivacyPreferenceResource
    {
        $user = $request->user();
        $preference = PrivacyPreference::firstOrCreate(['user_id' => $user->id]);

        Gate::authorize('update', $preference);

        $preference->update($request->validated());

        return new PrivacyPreferenceResource($preference->refresh());
    }
}