<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Shape returned by `GET /v1/donations/stats`.
 *
 * Matches `DonationStats` in `@shurokkha/contracts`.
 */
class DonationStatsResource extends JsonResource
{
    /**
     * @param  array<string,int|float|string>  $resource
     */
    public function __construct(array $resource)
    {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        /** @var array<string,int|float|string> $payload */
        $payload = $this->resource;

        return [
            'data' => [
                'total' => (int) ($payload['total'] ?? 0),
                'lifetime_sum' => (float) ($payload['lifetime_sum'] ?? 0.0),
                'recurring' => (int) ($payload['recurring'] ?? 0),
                'one_time' => (int) ($payload['one_time'] ?? 0),
                'pending' => (int) ($payload['pending'] ?? 0),
                'completed' => (int) ($payload['completed'] ?? 0),
            ],
        ];
    }
}
