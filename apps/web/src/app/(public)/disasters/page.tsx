import { Suspense } from "react"
import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { DisasterGrid } from "@/features/disasters/components/disaster-grid"
import { DisastersPreparednessCallout } from "@/features/disasters/components/disasters-preparedness-callout"
import { DisastersSkeleton } from "@/features/disasters/components/disasters-skeleton"

export const metadata: Metadata = {
  title: "Disasters",
  description:
    "Track current and recent disasters, affected areas, and official situation updates.",
}

/**
 * `/disasters` shell. Page-level composition: header → live list
 * → preparedness callout. `<DisasterGrid />` is a self-contained
 * client island that owns its data fetch + pending / error /
 * empty / populated branches; the surrounding `<Suspense>` boundary
 * provides the first-paint placeholder.
 */
export default function DisastersPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="Current and recent disasters"
          title="Disasters Shurokkha is monitoring"
          description="A read-only view of active and recent disasters surfaced by the coordination team. Each entry aggregates affected-area counts and the population reported impacted."
        />

        <Suspense fallback={<DisastersSkeleton />}>
          <DisasterGrid />
        </Suspense>

        <DisastersPreparednessCallout />
      </Container>
    </Section>
  )
}
