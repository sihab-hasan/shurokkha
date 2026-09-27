import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { ResourceCategoriesGrid } from "@/features/resources/components/resource-categories-grid"
import { ResourcesClarification } from "@/features/resources/components/resources-clarification"

export const metadata: Metadata = {
  title: "Resource library",
  description:
    "Verified emergency resources and references curated by the Shurokkha coordination team.",
}

/**
 * `/resources` shell. Page-level composition: header → category grid
 * → curation-principles callout.
 */
export default function ResourcesPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="Resource library"
          title="Verified emergency resources and references"
          description="Shurokkha’s resource library consolidates emergency guides, support services, and live shelter data into one browsable surface — all reviewed against official sources."
        />

        <ResourceCategoriesGrid />
        <ResourcesClarification />
      </Container>
    </Section>
  )
}
