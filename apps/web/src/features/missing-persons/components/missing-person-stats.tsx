"use client"

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Search,
} from "lucide-react"

import { MetricStrip } from "@shurokkha/ui/components/metric-strip"

import { ClickableKpiCard } from "@/features/shared/clickable-kpi-card"

import { useMissingPersonsList } from "../hooks/use-missing-persons-list"
import { useMissingPersonsQuery } from "../hooks/use-missing-persons-query"

import type { MissingPersonStatus } from "@shurokkha/contracts"

/**
 * Stats strip for the missing-persons page.
 *
 * Missing-persons has no `/stats` endpoint, so we derive counts from the
 * list response (`meta.total` for the global count) plus two extra
 * requests with `status=` for the "Searching" and "Located" buckets.
 *
 * Each KPI is clickable:
 * - All → clears filters
 * - Active → status=reported (single representative status; the full
 *   "active" bucket is reported + under_review + verified + searching)
 * - Searching → status=searching
 * - Located → status=located
 */
export function MissingPersonStats() {
  const { status, setStatus, hasActiveFilters, reset } =
    useMissingPersonsQuery()

  // Always fetch the unfiltered total for the "All" tile.
  const { data: totalData } = useMissingPersonsList({
    page: 1,
    per_page: 1,
  })
  const total = totalData?.meta.total ?? 0

  // "Searching" bucket — single status query.
  const { data: searchingData } = useMissingPersonsList({
    page: 1,
    per_page: 1,
    status: "searching",
  })
  const searching = searchingData?.meta.total ?? 0

  // "Located" bucket.
  const { data: locatedData } = useMissingPersonsList({
    page: 1,
    per_page: 1,
    status: "located",
  })
  const located = locatedData?.meta.total ?? 0

  const toggleSingle = (value: MissingPersonStatus) => {
    setStatus(status === value ? null : value)
  }

  return (
    <MetricStrip>
      <ClickableKpiCard
        title="All"
        value={total}
        detail="Lifetime reports you have filed."
        icon={<ClipboardList className="h-4 w-4" />}
        active={!hasActiveFilters}
        onClick={() => reset()}
      />
      <ClickableKpiCard
        title="Active"
        value={total - located}
        detail="Under review or actively searched."
        icon={<AlertTriangle className="h-4 w-4" />}
        active={status === "reported"}
        onClick={() => toggleSingle("reported")}
      />
      <ClickableKpiCard
        title="Searching"
        value={searching}
        detail="Field teams are actively searching."
        icon={<Search className="h-4 w-4" />}
        active={status === "searching"}
        onClick={() => toggleSingle("searching")}
      />
      <ClickableKpiCard
        title="Located"
        value={located}
        detail="Found and reunified."
        icon={<CheckCircle2 className="h-4 w-4" />}
        active={status === "located"}
        onClick={() => toggleSingle("located")}
      />
    </MetricStrip>
  )
}
