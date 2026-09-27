import { Badge } from "@shurokkha/ui/components/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@shurokkha/ui/components/card"

import type {
  PublicAffectedAreaRecord,
  PublicDisasterSeverity,
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

interface AffectedAreaCardProps {
  area: PublicAffectedAreaRecord
}

/**
 * Single affected-area card. Compact surface used inside the `/map`
 * region column; renders severity badge, parent disaster name, and
 * affected population.
 */
export function AffectedAreaCard({ area }: AffectedAreaCardProps) {
  return (
    <Card size="sm">
      <CardHeader className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {area.severity ? (
            <Badge variant={SEVERITY_VARIANT[area.severity]}>
              {area.severity}
            </Badge>
          ) : null}
        </div>
        <CardTitle className="text-sm">
          {area.disaster_name ?? "Affected area"}
        </CardTitle>
        <CardDescription className="text-xs">
          Population: {area.affected_population.toLocaleString()}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
