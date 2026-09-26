<?php

namespace App\Http\Resources;

use App\Models\AccountDeletionRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AccountDeletionRequest
 */
class AccountDeletionRequestResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'scheduled_for' => $this->scheduled_for?->toIso8601String(),
            'reason' => $this->reason,
            'cancelled_at' => $this->cancelled_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'grace_days' => AccountDeletionRequest::GRACE_DAYS,
        ];
    }
}