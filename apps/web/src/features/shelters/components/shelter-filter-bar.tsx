import {
  ToggleGroup,
  ToggleGroupItem,
} from "@shurokkha/ui/components/toggle-group"

import type { PublicShelterStatus } from "@shurokkha/contracts"

export const STATUS_FILTERS: ReadonlyArray<{
  label: string
  value: PublicShelterStatus | "all"
}> = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Full", value: "full" },
  { label: "Closed", value: "closed" },
]

interface ShelterFilterBarProps {
  value: PublicShelterStatus | "all"
  onChange: (next: PublicShelterStatus | "all") => void
}

/**
 * Status-segmented control for `/shelters`. Lifted out so the
 * `<SheltersSection>` aggregator stays declarative about filter
 * state and rendering without owning the toggle's a11y wiring.
 */
export function ShelterFilterBar({ value, onChange }: ShelterFilterBarProps) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(groupValue) => {
        const next = groupValue[0] as PublicShelterStatus | "all" | undefined
        if (next) onChange(next)
      }}
      aria-label="Filter shelters by status"
      variant="outline"
    >
      {STATUS_FILTERS.map((filter) => (
        <ToggleGroupItem key={filter.value} value={filter.value}>
          {filter.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
