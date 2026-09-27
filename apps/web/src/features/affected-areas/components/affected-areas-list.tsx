import { AffectedAreaCard } from "./affected-area-card"

import type { PublicAffectedAreaRecord } from "@shurokkha/contracts"

interface AffectedAreasListProps {
  areas: PublicAffectedAreaRecord[]
  /**
   * Cap how many cards render. The `/map` column only needs the top
   * few — leaving this open lets callers render the full list elsewhere
   * (e.g. an internal dashboard) without changing the component.
   */
  limit?: number
}

/**
 * Vertical list of affected-area cards. The list renders the first
 * `limit` items in the order provided (the API sorts critical first).
 */
export function AffectedAreasList({ areas, limit }: AffectedAreasListProps) {
  const visible = typeof limit === "number" ? areas.slice(0, limit) : areas
  return (
    <div className="space-y-2">
      {visible.map((area) => (
        <AffectedAreaCard key={area.area_id} area={area} />
      ))}
    </div>
  )
}
