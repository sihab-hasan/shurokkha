"use client"

import { AlertOctagon } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@shurokkha/ui/components/card"

import { usePublicDisasters } from "@/features/disasters/hooks/use-disasters"
import { titleCase } from "@/features/shared/formatters"

import { MapRegionColumn } from "./map-region-column"

import type { PublicDisasterSeverity } from "@shurokkha/contracts"

const SEVERITY_VARIANT: Record<
  PublicDisasterSeverity,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  Critical: "destructive",
  High: "warning",
  Medium: "info",
  Low: "secondary",
}

/**
 * Region column on `/map` showing the disasters endpoint output.
 * Compact cards (no bodies) so the column stays scannable when
 * stacked alongside the area and shelter columns.
 */
export function DisastersRegionColumn() {
  const { data, isPending, isError, error } = usePublicDisasters()

  const disasters = data?.data ?? []

  return (
    <MapRegionColumn
      title="Disasters"
      icon={<AlertOctagon className="size-4 text-primary" />}
      isPending={isPending}
      isError={isError}
      emptyMessage="No active disasters."
      errorMessage={
        (error as Error | undefined)?.message ?? "Could not load disasters."
      }
    >
      {disasters.map((disaster) => (
        <Card key={disaster.disaster_id} size="sm">
          <CardHeader className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {disaster.severity ? (
                <Badge variant={SEVERITY_VARIANT[disaster.severity]}>
                  {disaster.severity}
                </Badge>
              ) : null}
              <Badge variant="outline">
                {titleCase(disaster.status ?? "")}
              </Badge>
            </div>
            <CardTitle className="text-sm">{disaster.disaster_name}</CardTitle>
            <CardDescription className="text-xs">
              {disaster.affected_areas_count ?? 0} affected areas ·{" "}
              {(disaster.total_affected_population ?? 0).toLocaleString()}{" "}
              impacted
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </MapRegionColumn>
  )
}
