import { Suspense } from "react"
import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { ShelterGrid } from "@/features/shelters/components/shelter-grid"
import { SheltersSkeleton } from "@/features/shelters/components/shelters-skeleton"

export const metadata: Metadata = {
  title: "Shelters",
  description:
    "Locate available emergency shelters and essential services near affected areas.",
}

/**
 * `/shelters` shell. Page-level composition: header → shelter grid.
 * `<ShelterGrid />` is a self-contained client island that owns its
 * data fetch + filter state + status / error / empty / populated
 * branches. The surrounding `<Suspense>` boundary provides the
 * first-paint placeholder.
 */
export default function SheltersPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-8">
        <PageHeader
          eyebrow="Find shelter"
          title="Emergency shelters and safe spaces"
          description="Browse verified shelter availability. Capacity and occupancy are reported by the coordination team and updated as conditions change."
        />

        <Suspense fallback={<SheltersSkeleton />}>
          <ShelterGrid />
        </Suspense>
      </Container>
    </Section>
  )
}
