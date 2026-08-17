<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MissingPersonReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'age' => $this->age,
            'gender' => $this->gender?->value,
            'has_photo' => $this->photo_path !== null,
            'physical_description' => $this->physical_description,
            'distinguishing_features' => $this->distinguishing_features,
            'last_seen_at' => $this->last_seen_at?->toIso8601String(),
            'last_seen_location' => $this->last_seen_location,
            'latitude' => $this->latitude === null ? null : (float) $this->latitude,
            'longitude' => $this->longitude === null ? null : (float) $this->longitude,
            'contact_phone' => $this->contact_phone,
            'status' => $this->status->value,
            'found_at' => $this->found_at?->toIso8601String(),
            'closed_at' => $this->closed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
