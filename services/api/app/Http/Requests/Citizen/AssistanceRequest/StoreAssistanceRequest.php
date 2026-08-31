<?php

namespace App\Http\Requests\Citizen\AssistanceRequest;

use App\Enums\AssistanceRequestPriority;
use App\Enums\AssistanceRequestType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssistanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(AssistanceRequestType::class)],
            'priority' => ['required', Rule::enum(AssistanceRequestPriority::class)],
            'description' => ['required', 'string', 'min:10', 'max:3000'],
            'affected_people_count' => ['required', 'integer', 'min:1', 'max:10000'],
            'contact_phone' => ['required', 'string', 'max:32'],
            'address' => ['required', 'string', 'max:500'],
        ];
    }
}
