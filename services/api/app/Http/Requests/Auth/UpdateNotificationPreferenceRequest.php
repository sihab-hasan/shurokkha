<?php

namespace App\Http\Requests\Auth;

use App\Enums\DigestCadence;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNotificationPreferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cadences = array_map(fn (DigestCadence $c) => $c->value, DigestCadence::cases());

        return [
            'email_enabled' => ['required', 'boolean'],
            'sms_enabled' => ['required', 'boolean'],
            'push_enabled' => ['required', 'boolean'],
            'quiet_hours_start' => ['nullable', 'date_format:H:i'],
            'quiet_hours_end' => ['nullable', 'date_format:H:i'],
            'digest_cadence' => ['required', Rule::in($cadences)],
            'preferences' => ['nullable', 'array'],
            'preferences.*' => ['array'],
            'preferences.*.*' => ['string', Rule::in(['email', 'sms', 'push'])],
        ];
    }
}