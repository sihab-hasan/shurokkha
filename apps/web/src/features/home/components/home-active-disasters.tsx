"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

import { usePublicDisasters } from "@/features/disasters"
import { titleCase } from "@/features/shared/formatters"

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
 * "Active alerts" panel: up to 3 active disasters rendered as compact
 * cards with severity + status badges and a "See all" outbound link.
 * Shows an explanatory empty state while no active disasters are
 * reported.
 */
export function HomeActiveDisasters() {
  const { data, isPending } = usePublicDisasters()
  const activeDisasters = (data?.data ?? [])
    .filter((d) => d.status === "active")
    .slice(0, 3)

  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Active alerts"
        title="Active and recent disasters"
        align="left"
        className="mb-0"
      />
      {isPending ? (
        <Skeleton className="h-40 w-full" />
      ) : activeDisasters.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Nothing flagged active right now. Verified alerts and disaster
            entries will appear here as soon as the coordination team reports
            them.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {activeDisasters.map((disaster) => (
            <Card key={disaster.disaster_id} className="h-full">
              <CardContent className="space-y-2 p-5">
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
                <p className="font-medium">{disaster.disaster_name}</p>
                <p className="text-xs text-muted-foreground">
                  {(disaster.total_affected_population ?? 0).toLocaleString()}{" "}
                  impacted · {disaster.affected_areas_count ?? 0} areas
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Button
        nativeButton={false}
        variant="ghost"
        size="sm"
        render={<Link href="/disasters" />}
      >
        See all disasters
        <ArrowRight data-icon="inline-end" />
      </Button>
    </section>
  )
}
