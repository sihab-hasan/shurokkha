<?php

namespace App\Http\Requests\MissingPerson;

use Illuminate\Foundation\Http\FormRequest;

class BulkCloseMissingPersonReportsRequest extends FormRequest
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
