"use client"

import { Building2 } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@shurokkha/ui/components/card"

import { usePublicShelters } from "@/features/shelters/hooks/use-shelters"
import { titleCase } from "@/features/shared/formatters"

import { MapRegionColumn } from "./map-region-column"

/**
 * Region column on `/map` showing the shelters endpoint output.
 * Top 8 only. Status badge uses the same color contract as
 * {@link ShelterCard}.
 */
export function SheltersRegionColumn() {
  const { data, isPending, isError, error } = usePublicShelters()

  const shelters = data?.data ?? []

  return (
    <MapRegionColumn
      title="Shelters"
      icon={<Building2 className="size-4 text-primary" />}
      isPending={isPending}
      isError={isError}
      emptyMessage="No shelters listed."
      errorMessage={
        (error as Error | undefined)?.message ?? "Could not load shelters."
      }
    >
      {shelters.slice(0, 8).map((shelter) => (
        <Card key={shelter.shelter_id} size="sm">
          <CardHeader className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant={
                  shelter.status === "open"
                    ? "success"
                    : shelter.status === "full"
                      ? "warning"
                      : "secondary"
                }
              >
                {titleCase(shelter.status ?? "")}
              </Badge>
            </div>
            <CardTitle className="text-sm">{shelter.shelter_name}</CardTitle>
            <CardDescription className="text-xs">
              {shelter.occupancy} / {shelter.capacity} ·{" "}
              {shelter.available_seats} available
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </MapRegionColumn>
  )
}
