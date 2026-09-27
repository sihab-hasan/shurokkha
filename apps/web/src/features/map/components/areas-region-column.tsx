"use client"

import { TriangleAlert } from "lucide-react"

import { usePublicAffectedAreas } from "@/features/affected-areas/hooks/use-affected-areas"

import { AffectedAreasList } from "@/features/affected-areas/components/affected-areas-list"
import { MapRegionColumn } from "./map-region-column"

/**
 * Region column on `/map` showing the affected-areas endpoint output.
 * Top 8 only — the column is meant as an at-a-glance summary, not a
 * full directory. Full list lives on `/disasters`.
 */
export function AreasRegionColumn() {
  const { data, isPending, isError, error } = usePublicAffectedAreas()

  const areas = data?.data ?? []

  return (
    <MapRegionColumn
      title="Affected areas"
      icon={<TriangleAlert className="size-4 text-primary" />}
      isPending={isPending}
      isError={isError}
      emptyMessage="No affected areas reported."
      errorMessage={
        (error as Error | undefined)?.message ??
        "Could not load affected areas."
      }
    >
      <AffectedAreasList areas={areas} limit={8} />
    </MapRegionColumn>
  )
}
