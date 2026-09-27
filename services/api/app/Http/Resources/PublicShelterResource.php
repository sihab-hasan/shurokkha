<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public-facing projection of a shelter.
 *
 * The admin endpoint surfaces raw timestamps and the joined
 * `area_severity` / `affected_population` for editor dashboards. The
 * public projection only cares about what someone scanning
 * `/shelters` needs to decide where to go:
 *   - shelter_name, address context (area_severity if known)
 *   - capacity / occupancy (so they can see at a glance if seats are free)
 *   - status (open / full / closed)
 *
 * Available seats are derived here so the frontend never has to do
 * the subtraction (and never accidentally displays negative numbers).
 */
class PublicShelterResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $row = $this->resource;

        $capacity = isset($row->capacity) ? (int) $row->capacity : 0;
        $occupancy = isset($row->occupancy) ? (int) $row->occupancy : 0;
        $available = max(0, $capacity - $occupancy);

        return [
            'shelter_id' => isset($row->shelter_id) ? (int) $row->shelter_id : null,
            'shelter_name' => $row->shelter_name ?? null,
            'area_id' => isset($row->area_id) ? (int) $row->area_id : null,
            'area_severity' => $row->area_severity ?? null,
            'capacity' => $capacity,
            'occupancy' => $occupancy,
            'available_seats' => $available,
            'status' => $row->status ?? null,
        ];
    }
}
