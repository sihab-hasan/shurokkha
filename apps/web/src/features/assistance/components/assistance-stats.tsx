"use client"

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Hourglass,
} from "lucide-react"

import { MetricStrip } from "@shurokkha/ui/components/metric-strip"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import { ApiFailure } from "@/features/shared/api-feedback"
import { ClickableKpiCard } from "@/features/shared/clickable-kpi-card"

import { useAssistanceStats } from "../hooks/use-assistance-stats"

import { useAssistanceQuery } from "../hooks/use-assistance-query"

import type { AssistanceRequestStatus } from "@shurokkha/contracts"

/**
 * Top-of-page summary strip. Renders four KPI tiles backed by
 * `GET /v1/assistance-requests/stats`.
 *
 * Each tile is a clickable filter shortcut:
 * - All → clears filters
 * - Open → status=submitted (single representative status; the
 *   full "open" bucket is submitted + verified + assigned + in_progress,
 *   but single-select can only carry one value)
 * - In progress → status=in_progress
 * - Resolved → status=resolved
 *
 * Clicking an active tile removes its filter.
 */
export function AssistanceStats() {
  const { data, isPending, error, refetch } = useAssistanceStats()
  const { status, setStatus, reset, hasActiveFilters } = useAssistanceQuery()

  if (isPending) return <AssistanceStatsSkeleton />

  if (error || !data) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm">
        <ApiFailure
          error={error}
          fallback="We couldn't load your assistance summary."
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

  const toggleSingle = (value: AssistanceRequestStatus) => {
    setStatus(status === value ? null : value)
  }

  return (
    <MetricStrip>
      <ClickableKpiCard
        title="All"
        value={stats.total}
        detail="Lifetime requests you have submitted."
        icon={<ClipboardList className="h-4 w-4" />}
        active={!hasActiveFilters}
        onClick={() => reset()}
      />
      <ClickableKpiCard
        title="Open"
        value={stats.open}
        detail="Awaiting verification or assignment."
        icon={<AlertTriangle className="h-4 w-4" />}
        active={status === "submitted"}
        onClick={() => toggleSingle("submitted")}
      />
      <ClickableKpiCard
        title="In progress"
        value={stats.in_progress}
        detail="Relief teams are actively working on these."
        icon={<Hourglass className="h-4 w-4" />}
        active={status === "in_progress"}
        onClick={() => toggleSingle("in_progress")}
      />
      <ClickableKpiCard
        title="Resolved"
        value={stats.resolved}
        detail="Closed out by the relief coordination team."
        icon={<CheckCircle2 className="h-4 w-4" />}
        active={status === "resolved"}
        onClick={() => toggleSingle("resolved")}
      />
    </MetricStrip>
  )
}

function AssistanceStatsSkeleton() {
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
