import { ShelterCard } from "./shelter-card"

import type { PublicShelterRecord } from "@shurokkha/contracts"

interface ShelterListProps {
  shelters: PublicShelterRecord[]
}

/**
 * Responsive grid of shelter cards. Matches the disaster grid
 * breakpoints so the two list pages feel consistent.
 */
export function ShelterList({ shelters }: ShelterListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {shelters.map((shelter) => (
        <ShelterCard key={shelter.shelter_id} shelter={shelter} />
      ))}
    </div>
  )
}