<?php

namespace App\Http\Resources;

use App\Models\DataExportRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin DataExportRequest
 */
class DataExportRequestResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'download_url' => $this->status === DataExportRequest::STATUS_READY
                ? route('api.v1.auth.me.data-export.download', [], false)
                : null,
            'ready_at' => $this->ready_at?->toIso8601String(),
            'expires_at' => $this->expires_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}