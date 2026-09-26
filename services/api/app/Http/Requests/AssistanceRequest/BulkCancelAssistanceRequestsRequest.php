<?php

namespace App\Http\Requests\AssistanceRequest;

use Illuminate\Foundation\Http\FormRequest;

class BulkCancelAssistanceRequestsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'min:1', 'max:50'],
            'ids.*' => ['required', 'string'],
        ];
    }
}
