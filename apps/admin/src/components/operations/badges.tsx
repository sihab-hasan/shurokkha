"use client"

import { CheckCircle2, Navigation } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"

import type {
  AffectedAreaSeverity,
  AssignmentStatus,
  RescueTeamAvailability,
} from "@/hooks/operations/types"

/**
 * Centralized badge styling for the operations dashboard.
 *
 * Components import from here so colors stay consistent across tables,
 * details pages, and future surfaces. Badge values map 1:1 to the
 * contract enums (see `@shurokkha/contracts`).
 */

const SEVERITY_CLASS: Record<string, string> = {
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  High: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  Medium: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  Low: "bg-muted text-muted-foreground",
}

/** Tailwind class string for a severity pill (table use). */
export function severityBadgeClass(severity: string): string {
  return (
    SEVERITY_CLASS[severity] ??
    SEVERITY_CLASS[
      Object.keys(SEVERITY_CLASS).find(
        (k) => k.toLowerCase() === severity?.toLowerCase()
      ) ?? ""
    ] ??
    "bg-muted text-muted-foreground"
  )
}

const AVAILABILITY_CLASS: Record<RescueTeamAvailability, string> = {
  available:
    "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  busy: "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",
  offline: "text-muted-foreground",
}

const SHELTER_STATUS_CLASS: Record<string, string> = {
  open: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  full: "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",
  closed: "text-muted-foreground",
}

/** Tailwind class string for a shelter status pill. */
export function statusBadgeClass(status: string): string {
  const key = (status ?? "").toLowerCase()
  return (
    SHELTER_STATUS_CLASS[key] ??
    "border-muted-foreground/30 bg-muted text-muted-foreground"
  )
}

/** Tailwind class string for a team availability pill (table use). */
export function availabilityBadgeClass(
  availability: string | RescueTeamAvailability
): string {
  const key = (availability ?? "").toLowerCase() as RescueTeamAvailability
  return (
    AVAILABILITY_CLASS[key] ??
    "border-muted-foreground/30 bg-muted text-muted-foreground"
  )
}

const ASSIGNMENT_CLASS: Record<AssignmentStatus, string> = {
  completed:
    "gap-1 border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  on_route:
    "gap-1 border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-400",
  assigned:
    "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",
  cancelled: "text-muted-foreground",
}

/** Tailwind class string for an assignment-status pill (table use). */
export function assignmentStatusBadgeClass(
  status: string | AssignmentStatus
): string {
  const key = (status ?? "").toLowerCase() as AssignmentStatus
  return (
    ASSIGNMENT_CLASS[key] ??
    "border-muted-foreground/30 bg-muted text-muted-foreground"
  )
}

/**
 * Rendered availability badge used in details headers (full label + dot).
 * Returns the three-state badge set inline rather than as a class.
 */
export function AvailabilityBadge({
  availability,
}: {
  availability: string | RescueTeamAvailability
}) {
  switch ((availability ?? "").toLowerCase()) {
    case "available":
      return (
        <Badge
          className={
            "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          }
        >
          ● Available
        </Badge>
      )
    case "busy":
      return (
        <Badge
          className={
            "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400"
          }
        >
          ● Busy on Mission
        </Badge>
      )
    case "offline":
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          ○ Offline
        </Badge>
      )
  }
}

/**
 * Rendered assignment-status badge used in details headers / cells that
 * want the icon next to the label. Tables that need compact pills should
 * use `assignmentStatusBadgeClass` directly with `<Badge>`.
 */
export function AssignmentStatusBadge({
  status,
}: {
  status: string | AssignmentStatus
}) {
  const key = (status ?? "").toLowerCase()
  switch (key) {
    case "completed":
      return (
        <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-3" /> Completed
        </Badge>
      )
    case "on_route":
      return (
        <Badge className="gap-1 border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-400">
          <Navigation className="size-3" /> On Route
        </Badge>
      )
    case "assigned":
      return (
        <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400">
          Assigned
        </Badge>
      )
    case "cancelled":
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Cancelled
        </Badge>
      )
  }
}

export type { AffectedAreaSeverity }
