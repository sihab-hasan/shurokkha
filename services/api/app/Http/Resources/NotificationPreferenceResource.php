<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationPreferenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'email_enabled' => (bool) $this->email_enabled,
            'sms_enabled' => (bool) $this->sms_enabled,
            'push_enabled' => (bool) $this->push_enabled,
            'quiet_hours_start' => $this->quiet_hours_start?->format('H:i'),
            'quiet_hours_end' => $this->quiet_hours_end?->format('H:i'),
            'digest_cadence' => $this->digest_cadence?->value,
            'preferences' => $this->preferences_json ?? [],
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}