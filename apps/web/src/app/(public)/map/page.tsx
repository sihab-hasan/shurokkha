import { Suspense } from "react"
import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { AreasRegionColumn } from "@/features/map/components/areas-region-column"
import { DisastersRegionColumn } from "@/features/map/components/disasters-region-column"
import { MapDataBanner } from "@/features/map/components/map-data-banner"
import { MapSkeleton } from "@/features/map/components/map-skeleton"
import { SheltersRegionColumn } from "@/features/map/components/shelters-region-column"

export const metadata: Metadata = {
  title: "Live Operations Map",
  description:
    "View disasters, emergency alerts, shelters, relief services, and help requests on one live map.",
}

/**
 * `/map` shell. Page-level composition: header → banner → 3-up
 * region grid. Each region column is a self-contained client island
 * that fetches its own data independently, so one slow endpoint
 * never blocks the others. The `<Suspense>` boundary provides a
 * first-paint placeholder through `MapSkeleton`.
 */
export default function LiveOperationsMapPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-8">
        <PageHeader
          eyebrow="Live operations map"
          title="Where Shurokkha is responding"
          description="A single read-only view that combines disasters, affected areas, and shelter availability surfaced by the coordination team."
        />

        <MapDataBanner />

        <Suspense fallback={<MapSkeleton />}>
          <div className="grid gap-6 lg:grid-cols-3">
            <DisastersRegionColumn />
            <AreasRegionColumn />
            <SheltersRegionColumn />
          </div>
        </Suspense>
      </Container>
    </Section>
  )
}
