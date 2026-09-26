<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrivacyPreferenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'location_sharing' => $this->location_sharing?->value,
            'profile_visibility' => $this->profile_visibility?->value,
            'anonymous_donations' => (bool) $this->anonymous_donations,
            'data_export_requested_at' => $this->data_export_requested_at?->toIso8601String(),
            'account_deletion_requested_at' => $this->account_deletion_requested_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}