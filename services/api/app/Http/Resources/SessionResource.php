<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this['id'],
            'ip' => $this['ip'],
            'user_agent' => $this['user_agent'],
            'last_active_at' => $this['last_active_at'],
            'is_current' => $this['is_current'] ?? true,
        ];
    }
}