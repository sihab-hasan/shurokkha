<?php

namespace App\Http\Resources;

use App\Models\LoginAudit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin LoginAudit
 */
class LoginAuditResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'successful' => (bool) $this->successful,
            'failure_reason' => $this->failure_reason,
            'signed_in_at' => $this->signed_in_at?->toIso8601String(),
            'signed_out_at' => $this->signed_out_at?->toIso8601String(),
            'is_current_session' => false, // populated by SessionController when relevant
        ];
    }
}