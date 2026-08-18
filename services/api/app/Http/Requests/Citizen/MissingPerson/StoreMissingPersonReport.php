<?php

namespace App\Http\Requests\Citizen\MissingPerson;

use App\Enums\Gender;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMissingPersonReport extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:160'],
            'age' => ['nullable', 'integer', 'min:0', 'max:130'],
            'gender' => ['nullable', Rule::enum(Gender::class)],
            'photo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'physical_description' => ['nullable', 'string', 'max:3000'],
            'distinguishing_features' => ['nullable', 'string', 'max:2000'],
            'last_seen_at' => ['required', 'date', 'before_or_equal:now'],
            'last_seen_location' => ['required', 'string', 'max:500'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90', 'required_with:longitude'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180', 'required_with:latitude'],
            'contact_phone' => ['required', 'string', 'max:32'],
        ];
    }
}
