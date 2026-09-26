<?php

namespace App\Http\Requests\Donation;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation for `POST /v1/donations`.
 *
 * The controller stamps `user_id`, `status`, `currency`, and
 * `receipt_number` itself; the client cannot inject any of them.
 */
class StoreDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'donation_kind' => ['required', 'string', 'in:'.implode(',', IndexDonationsRequest::TYPES)],
            'amount' => ['required', 'numeric', 'min:1', 'max:99999999.99'],
            'payment_method' => ['sometimes', 'nullable', 'string', 'in:'.implode(',', IndexDonationsRequest::PAYMENT_METHODS)],
            'campaign_title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'currency' => ['sometimes', 'string', 'size:3'],
        ];
    }
}
