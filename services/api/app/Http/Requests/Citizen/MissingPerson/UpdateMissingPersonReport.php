<?php

namespace App\Http\Requests\Citizen\MissingPerson;

use App\Enums\Gender;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMissingPersonReport extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['sometimes', 'string', 'max:160'],
            'age' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:130'],
            'gender' => ['sometimes', 'nullable', Rule::enum(Gender::class)],
            'photo' => ['sometimes', 'nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_photo' => ['sometimes', 'boolean'],
            'physical_description' => ['sometimes', 'nullable', 'string', 'max:3000'],
            'distinguishing_features' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'last_seen_at' => ['sometimes', 'date', 'before_or_equal:now'],
            'last_seen_location' => ['sometimes', 'string', 'max:500'],
            'latitude' => ['sometimes', 'nullable', 'numeric', 'between:-90,90', 'required_with:longitude'],
            'longitude' => ['sometimes', 'nullable', 'numeric', 'between:-180,180', 'required_with:latitude'],
            'contact_phone' => ['sometimes', 'string', 'max:32'],
        ];
    }
}
