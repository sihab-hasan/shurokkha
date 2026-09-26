"use client"

import { CircleDot, ClipboardList, Heart, Repeat } from "lucide-react"

import { MetricStrip } from "@shurokkha/ui/components/metric-strip"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import { ApiFailure } from "@/features/shared/api-feedback"
import { ClickableKpiCard } from "@/features/shared/clickable-kpi-card"

import { useDonationsStats } from "../hooks/use-donations-stats"

import { useDonationsQuery } from "../hooks/use-donations-query"

import type { DonationKind, DonationStatus } from "@shurokkha/contracts"

/**
 * Top-of-page summary strip. Renders four KPI tiles backed by
 * `GET /v1/donations/stats`.
 *
 * Each tile is a clickable filter shortcut:
 * - All → clears filters
 * - Completed → status=completed
 * - Pending → status=pending
 * - Recurring → type=recurring
 *
 * Clicking an active tile removes its filter.
 */
export function DonationsStats() {
  const { data, isPending, error, refetch } = useDonationsStats()
  const { status, setStatus, type, setType, reset, hasActiveFilters } =
    useDonationsQuery()

  if (isPending) return <DonationsStatsSkeleton />

  if (error || !data) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm">
        <ApiFailure
          error={error}
          fallback="We couldn't load your donations summary."
        />
        <button
          type="button"
          onClick={() => refetch()}
          className="shrink-0 text-xs font-medium text-danger underline-offset-4 hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  const stats = data.data

  const toggleStatus = (value: DonationStatus) => {
    setStatus(status === value ? null : value)
  }
  const toggleType = (value: DonationKind) => {
    setType(type === value ? null : value)
  }

  // Format the lifetime sum in compact BDT for the KPI value space.
  const lifetimeLabel =
    stats.lifetime_sum > 0
      ? `৳${stats.lifetime_sum.toLocaleString()} all-time`
      : "No donations yet"

  return (
    <MetricStrip>
      <ClickableKpiCard
        title="All"
        value={stats.total}
        detail={lifetimeLabel}
        icon={<ClipboardList className="h-4 w-4" />}
        active={!hasActiveFilters}
        onClick={() => reset()}
      />
      <ClickableKpiCard
        title="Completed"
        value={stats.completed}
        detail="Confirmed by the receiving organisation."
        icon={<Heart className="h-4 w-4" />}
        active={status === "completed"}
        onClick={() => toggleStatus("completed")}
      />
      <ClickableKpiCard
        title="Pending"
        value={stats.pending}
        detail="Awaiting confirmation from the receiving organisation."
        icon={<CircleDot className="h-4 w-4" />}
        active={status === "pending"}
        onClick={() => toggleStatus("pending")}
      />
      <ClickableKpiCard
        title="Recurring"
        value={stats.recurring}
        detail="Monthly or scheduled contributions."
        icon={<Repeat className="h-4 w-4" />}
        active={type === "recurring"}
        onClick={() => toggleType("recurring")}
      />
    </MetricStrip>
  )
}

function DonationsStatsSkeleton() {
  return (
    <MetricStrip>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border bg-card text-card-foreground shadow"
        >
          <div className="p-6 pb-2">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2 p-6 pt-0">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </MetricStrip>
  )
}
