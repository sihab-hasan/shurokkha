"use client"

import { DisasterCard } from "./disaster-card"
import { DisastersEmptyState } from "./disasters-empty-state"
import { DisastersErrorState } from "./disasters-error-state"
import { DisastersSkeleton } from "./disasters-skeleton"

import { usePublicDisasters } from "../hooks/use-disasters"

/**
 * Self-contained disaster list island for `/disasters`. Owns the
 * data fetch via `usePublicDisasters` and branches across pending /
 * error / empty / populated states. The route page renders this as a
 * single peer call inside a `<Suspense fallback={<DisastersSkeleton />}>`
 * boundary.
 */
export function DisasterGrid() {
  const { data, isPending, isError, error } = usePublicDisasters()

  if (isPending) {
    return <DisastersSkeleton />
  }

  if (isError) {
    return <DisastersErrorState error={error} />
  }

  const disasters = data?.data ?? []

  if (disasters.length === 0) {
    return <DisastersEmptyState />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {disasters.map((disaster) => (
        <DisasterCard key={disaster.disaster_id} disaster={disaster} />
      ))}
    </div>
  )
}