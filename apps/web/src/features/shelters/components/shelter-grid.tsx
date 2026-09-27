"use client"

import { useState } from "react"

import { ShelterFilterBar } from "./shelter-filter-bar"
import { ShelterList } from "./shelter-list"
import { ShelterSummary } from "./shelter-summary"
import { SheltersEmptyState } from "./shelters-empty-state"
import { SheltersErrorState } from "./shelters-error-state"
import { SheltersSkeleton } from "./shelters-skeleton"

import { usePublicShelters } from "../hooks/use-shelters"

import type { PublicShelterStatus } from "@shurokkha/contracts"

/**
 * Self-contained shelter list island for `/shelters`. Owns the data
 * fetch via `usePublicShelters`, the status filter state, and the
 * pending / error / empty / populated branches. The route page
 * renders this as a single peer call inside a `<Suspense
 * fallback={<SheltersSkeleton />}>`
 */
export function ShelterGrid() {
  const [statusFilter, setStatusFilter] = useState<
    PublicShelterStatus | "all"
  >("all")

  const { data, isPending, isError, error } = usePublicShelters({
    status: statusFilter === "all" ? undefined : statusFilter,
  })

  if (isPending) {
    return <SheltersSkeleton />
  }

  if (isError) {
    return <SheltersErrorState error={error} />
  }

  const shelters = data?.data ?? []
  const openCount = shelters.filter((s) => s.status === "open").length
  const fullCount = shelters.filter((s) => s.status === "full").length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ShelterFilterBar value={statusFilter} onChange={setStatusFilter} />
        <ShelterSummary
          total={shelters.length}
          open={openCount}
          full={fullCount}
        />
      </div>

      {shelters.length === 0 ? (
        <SheltersEmptyState />
      ) : (
        <ShelterList shelters={shelters} />
      )}
    </div>
  )
}