"use client"

import { X } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"

import {
  useDonationsQuery,
  type ActiveFilter,
} from "../hooks/use-donations-query"

/**
 * Row of removable chips that visualise the current active filters.
 * Returns `null` when no filters are active so it never adds noise to
 * the empty state.
 */
export function DonationsFilterChips() {
  const { activeFilters, hasActiveFilters, removeFilter, reset } =
    useDonationsQuery()

  if (!hasActiveFilters) return null

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="region"
      aria-label="Active filters"
    >
      {activeFilters.map((filter: ActiveFilter) => (
        <Badge key={filter.key} variant="secondary" className="pr-1">
          <span className="font-medium text-muted-foreground">
            {filter.label}:
          </span>
          <span className="ml-1.5">{filter.displayValue}</span>
          <button
            type="button"
            onClick={() => removeFilter(filter.key)}
            aria-label={`Remove ${filter.label} filter`}
            className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {activeFilters.length > 1 ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={reset}
          className="h-6 px-2 text-xs"
        >
          Clear all
        </Button>
      ) : null}
    </div>
  )
}
