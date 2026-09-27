import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { ResourceServicesGrid } from "@/features/resources/components/resource-services-grid"

export const metadata: Metadata = {
  title: "Support services",
  description:
    "Coordinated disaster support pathways — emergency assistance, food and supplies, medical support, and recovery pathways.",
}

/**
 * `/resources/support-services` shell. Page-level composition:
 * header → four-lane service grid.
 */
export default function SupportServicesPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="Support services"
          title="Coordinated disaster support pathways"
          description="Four service lanes Shurokkha helps coordinate end-to-end: emergency assistance, food and supplies, medical support, and recovery pathways."
        />

        <ResourceServicesGrid />
      </Container>
    </Section>
  )
}
