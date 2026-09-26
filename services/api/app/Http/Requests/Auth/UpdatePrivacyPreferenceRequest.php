<?php

namespace App\Http\Requests\Auth;

use App\Enums\LocationSharing;
use App\Enums\ProfileVisibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePrivacyPreferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $sharing = array_map(fn (LocationSharing $c) => $c->value, LocationSharing::cases());
        $visibility = array_map(fn (ProfileVisibility $c) => $c->value, ProfileVisibility::cases());

        return [
            'location_sharing' => ['required', Rule::in($sharing)],
            'profile_visibility' => ['required', Rule::in($visibility)],
            'anonymous_donations' => ['required', 'boolean'],
        ];
    }
}