<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class UpdatePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string'],
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(12)->mixedCase()->numbers()->symbols(),
            ],
        ];
    }

    /**
     * Re-validate `current_password` against the user record after the
     * framework has run the basic rules. Laravel's `confirmed` rule
     * already handled `password_confirmation` matching.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $user = $this->user();
            if (! $user) {
                return;
            }

            if (! Hash::check((string) $this->input('current_password'), (string) $user->getAuthPassword())) {
                $validator->errors()->add('current_password', 'Current password is incorrect.');
            }
        });
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new ValidationException($validator);
    }
}