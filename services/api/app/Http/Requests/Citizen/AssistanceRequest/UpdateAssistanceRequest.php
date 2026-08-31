<?php

namespace App\Http\Requests\Citizen\AssistanceRequest;

use App\Enums\AssistanceRequestPriority;
use App\Enums\AssistanceRequestType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssistanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['sometimes', Rule::enum(AssistanceRequestType::class)],
            'priority' => ['sometimes', Rule::enum(AssistanceRequestPriority::class)],
            'description' => ['sometimes', 'string', 'min:10', 'max:3000'],
            'affected_people_count' => ['sometimes', 'integer', 'min:1', 'max:10000'],
            'contact_phone' => ['sometimes', 'string', 'max:32'],
            'address' => ['sometimes', 'string', 'max:500'],
        ];
    }
}
