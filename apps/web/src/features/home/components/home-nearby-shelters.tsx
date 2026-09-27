"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

import { usePublicShelters } from "@/features/shelters"
import { titleCase } from "@/features/shared/formatters"

/**
 * "Find help nearby" panel: 4 most recent shelters rendered as compact
 * cards with capacity and status. Falls back to an explanatory empty
 * state when no shelters are registered yet.
 */
export function HomeNearbyShelters() {
  const { data, isPending } = usePublicShelters()
  const openShelters = (data?.data ?? []).slice(0, 4)

  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Find help nearby"
        title="Nearby shelters"
        align="left"
        className="mb-0"
      />
      {isPending ? (
        <Skeleton className="h-32 w-full" />
      ) : openShelters.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No shelters have been registered yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {openShelters.map((shelter) => (
            <Card key={shelter.shelter_id} className="h-full">
              <CardContent className="space-y-1 p-5">
                <p className="font-medium">{shelter.shelter_name}</p>
                <p className="text-xs text-muted-foreground">
                  {shelter.occupancy} / {shelter.capacity} ·{" "}
                  {shelter.available_seats} available
                </p>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Button
        nativeButton={false}
        variant="ghost"
        size="sm"
        render={<Link href="/shelters" />}
      >
        Browse all shelters
        <ArrowRight data-icon="inline-end" />
      </Button>
    </section>
  )
}
