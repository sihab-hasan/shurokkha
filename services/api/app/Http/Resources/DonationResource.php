<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Maps a `Donation` row to the `DonationRecord` contract shape.
 *
 * Field order matches the contracts package so the JSON keys appear in
 * the same order in dev tools / tests.
 */
class DonationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'donation_id' => $this->donation_id,
            'donation_kind' => $this->donation_kind,
            'amount' => (float) $this->amount,
            'currency' => $this->currency ?? 'BDT',
            'campaign_title' => $this->campaign_title,
            'payment_method' => $this->payment_method,
            'receipt_number' => $this->receipt_number,
            'status' => $this->status,
            'created_at' => optional($this->created_at)->toIso8601String(),
            'updated_at' => optional($this->updated_at)->toIso8601String(),
        ];
    }
}
