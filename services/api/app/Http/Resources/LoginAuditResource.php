<?php

namespace App\Http\Resources;

use App\Models\LoginAudit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin LoginAudit
 *
 * Tolerant of either an Eloquent model or a raw stdClass row from
 * `DB::select()` — controllers in this codebase mix both styles.
 */
class LoginAuditResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $iso = static function ($value): ?string {
            if ($value === null || $value === '') {
                return null;
            }
            if ($value instanceof \DateTimeInterface) {
                return $value->format(\DateTimeInterface::ATOM);
            }

            return (string) $value;
        };

        return [
            'id' => (int) $this->id,
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'successful' => (bool) $this->successful,
            'failure_reason' => $this->failure_reason,
            'signed_in_at' => $iso($this->signed_in_at ?? null),
            'signed_out_at' => $iso($this->signed_out_at ?? null),
            'is_current_session' => false, // populated by SessionController when relevant
        ];
    }
}