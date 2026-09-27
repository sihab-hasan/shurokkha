<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public-facing projection of an affected area.
 *
 * Surfaces the parent disaster's name alongside the location info so
 * the `/map` page (or any future public listing) can render without
 * a second request. Mirrors the shape used by {@see PublicShelterResource}
 * for cross-resource consistency.
 */
class PublicAffectedAreaResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $row = $this->resource;

        return [
            'area_id' => isset($row->area_id) ? (int) $row->area_id : null,
            'disaster_id' => isset($row->disaster_id) ? (int) $row->disaster_id : null,
            'disaster_name' => $row->disaster_name ?? null,
            'affected_population' => isset($row->affected_population)
                ? (int) $row->affected_population
                : 0,
            'severity' => $row->severity ?? null,
        ];
    }
}
