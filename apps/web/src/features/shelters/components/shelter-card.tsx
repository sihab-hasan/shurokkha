import { MapPin, Users } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

import { titleCase } from "@/features/shared/formatters"

import type {
  PublicShelterRecord,
  PublicShelterStatus,
} from "@shurokkha/contracts"

const STATUS_VARIANT: Record<
  PublicShelterStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  open: "success",
  full: "warning",
  closed: "secondary",
}

interface ShelterCardProps {
  shelter: PublicShelterRecord
}

/**
 * Single shelter card. Shows status + area-severity badges, the shelter
 * name, affected-area label, capacity / occupancy / available-seats
 * triple, and a fill-percent progress bar.
 *
 * `fillPercent` is computed here rather than in the resource so changes
 * to the visual range stay local to the UI.
 */
export function ShelterCard({ shelter }: ShelterCardProps) {
  const statusVariant = shelter.status
    ? (STATUS_VARIANT[shelter.status] ?? "secondary")
    : "secondary"

  const fillPercent =
    shelter.capacity > 0
      ? Math.min(100, Math.round((shelter.occupancy / shelter.capacity) * 100))
      : 0

  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant}>
            {titleCase(shelter.status ?? "")}
          </Badge>
          {shelter.area_severity ? (
            <Badge variant="outline">Area: {shelter.area_severity}</Badge>
          ) : null}
        </div>
        <CardTitle className="text-lg">{shelter.shelter_name}</CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-xs">
          <MapPin className="size-3.5" />
          {shelter.area_id !== null
            ? `Affected area #${shelter.area_id}`
            : "Location not pinned"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="size-4 text-muted-foreground" />
          <span className="tabular-nums">
            {shelter.occupancy} / {shelter.capacity}
          </span>
          <span className="text-xs text-muted-foreground">
            · {shelter.available_seats} seat
            {shelter.available_seats === 1 ? "" : "s"} available
          </span>
        </div>
        <div
          aria-hidden
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
