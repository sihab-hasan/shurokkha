<?php

namespace App\Http\Requests\Citizen\AssistanceRequest;

use App\Enums\AssistanceRequestStatus;
use App\Enums\AssistanceRequestType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListAssistanceRequestsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['sometimes', 'string', 'max:120'],
            'status' => ['sometimes', Rule::enum(AssistanceRequestStatus::class)],
            'type' => ['sometimes', Rule::enum(AssistanceRequestType::class)],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ];
    }
}
