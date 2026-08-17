import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type DataFreshnessStatus =
  "live" | "fresh" | "stale" | "updating" | "offline"

export type DataFreshnessProps = React.ComponentProps<"div"> & {
  status?: DataFreshnessStatus
  label?: React.ReactNode
  updatedAt?: React.ReactNode
  action?: React.ReactNode
  compact?: boolean
}

const defaultLabels: Record<DataFreshnessStatus, string> = {
  live: "Live",
  fresh: "Up to date",
  stale: "May be outdated",
  updating: "Updating",
  offline: "Offline",
}

const dotClasses: Record<DataFreshnessStatus, string> = {
  live: "bg-success",
  fresh: "bg-info",
  stale: "bg-warning",
  updating: "bg-info animate-pulse",
  offline: "bg-muted-foreground",
}

export function DataFreshness({
  status = "fresh",
  label,
  updatedAt,
  action,
  compact = false,
  className,
  ...props
}: DataFreshnessProps) {
  return (
    <div
      data-ui-pattern="data-freshness"
      data-status={status}
      role="status"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground",
        compact ? "text-xs" : "text-sm",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dotClasses[status])}
      />
      <span className="font-medium text-foreground">
        {label ?? defaultLabels[status]}
      </span>
      {updatedAt ? (
        <span className="text-muted-foreground">{updatedAt}</span>
      ) : null}
      {action ? <span className="ml-auto shrink-0">{action}</span> : null}
    </div>
  )
}
