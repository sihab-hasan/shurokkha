<?php

namespace App\Http\Resources;

use App\Enums\AssistanceRequestStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource wrapping assistance-request dashboard stats.
 *
 * `totals_by_status` is the raw `status => count` map for the caller.
 * `summary` carries the four canonical buckets the dashboard renders directly.
 */
class AssistanceRequestStatsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var array<string,int> $totals */
        $totals = $this->resource;

        return [
            'total' => array_sum($totals),
            'open' => (int) ($totals[AssistanceRequestStatus::Submitted->value] ?? 0),
            'in_progress' => (int) ($totals[AssistanceRequestStatus::InProgress->value] ?? 0),
            'resolved' => (int) ($totals[AssistanceRequestStatus::Resolved->value] ?? 0),
            'totals_by_status' => $totals,
        ];
    }
}
