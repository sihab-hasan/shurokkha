<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'phone' => $this->phone,
            'phone_verified_at' => $this->phone_verified_at?->toIso8601String(),
            'avatar_url' => $this->avatar_url,
            'timezone' => $this->timezone,
            'two_factor_confirmed_at' => $this->two_factor_confirmed_at?->toIso8601String(),
            'role' => $this->role?->value,
        ];
    }
}