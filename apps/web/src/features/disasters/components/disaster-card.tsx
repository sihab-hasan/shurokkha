import { AlertTriangle, CalendarClock } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

import { formatDateTime, titleCase } from "@/features/shared/formatters"

import type {
  PublicDisasterRecord,
  PublicDisasterSeverity,
  PublicDisasterStatus,
} from "@shurokkha/contracts"

const SEVERITY_VARIANT: Record<
  PublicDisasterSeverity,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  Critical: "destructive",
  High: "warning",
  Medium: "info",
  Low: "secondary",
}

const STATUS_VARIANT: Record<
  PublicDisasterStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  active: "destructive",
  monitoring: "warning",
  resolved: "success",
}

interface DisasterCardProps {
  disaster: PublicDisasterRecord
}

/**
 * Single disaster card. Renders severity + status badges, the disaster
 * name, start timestamp, and the aggregate affected-area / population
 * counts. Variants are sourced from shared badge enum tables.
 */
export function DisasterCard({ disaster }: DisasterCardProps) {
  const severityVariant = disaster.severity
    ? (SEVERITY_VARIANT[disaster.severity] ?? "secondary")
    : "secondary"
  const statusVariant = disaster.status
    ? (STATUS_VARIANT[disaster.status] ?? "secondary")
    : "secondary"

  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={severityVariant}>
            <AlertTriangle className="mr-1 size-3" />
            {titleCase(disaster.severity)}
          </Badge>
          <Badge variant={statusVariant}>{titleCase(disaster.status)}</Badge>
        </div>
        <CardTitle className="text-lg">{disaster.disaster_name}</CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-xs">
          <CalendarClock className="size-3.5" />
          {disaster.start_datetime
            ? `Started ${formatDateTime(disaster.start_datetime)}`
            : "Start time pending"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-muted/45 p-3">
          <p className="text-xs text-muted-foreground">Affected areas</p>
          <p className="mt-0.5 font-heading text-xl font-semibold tabular-nums">
            {disaster.affected_areas_count ?? 0}
          </p>
        </div>
        <div className="rounded-lg bg-muted/45 p-3">
          <p className="text-xs text-muted-foreground">Population impacted</p>
          <p className="mt-0.5 font-heading text-xl font-semibold tabular-nums">
            {(disaster.total_affected_population ?? 0).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
