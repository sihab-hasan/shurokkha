<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public-facing projection of a disaster.
 *
 * Compared to the admin payload we drop administrative timestamps and
 * the raw foreign keys, and present only the fields a guest browsing
 * `/disasters` should see. Aggregate counts (affected areas / population)
 * are surfaced as `affected_areas_count` / `total_affected_population`
 * when present, matching the admin endpoint's aggregate query.
 */
class PublicDisasterResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $row = $this->resource;

        return [
            'disaster_id' => isset($row->disaster_id) ? (int) $row->disaster_id : null,
            'disaster_name' => $row->disaster_name ?? null,
            'severity' => $row->severity ?? null,
            'status' => $row->status ?? null,
            'start_datetime' => $row->start_datetime ?? null,
            'affected_areas_count' => isset($row->total_affected_areas)
                ? (int) $row->total_affected_areas
                : null,
            'total_affected_population' => isset($row->total_affected_population)
                ? (int) $row->total_affected_population
                : null,
        ];
    }
}
