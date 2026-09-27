import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { GuidePhasesGrid } from "@/features/resources/components/guide-phases-grid"
import { GuidesSupportCallout } from "@/features/resources/components/guides-support-callout"

export const metadata: Metadata = {
  title: "Emergency guides",
  description:
    "Practical guidance across the disaster cycle — prepare, respond, evacuate, recover — verified against official Bangladesh sources.",
}

/**
 * `/resources/guides` shell. Page-level composition: header →
 * four-phase checklist grid → support callout.
 */
export default function EmergencyGuidesPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="Emergency guides"
          title="Practical guidance across the disaster cycle"
          description="Four connected guides — prepare, respond, evacuate, recover — drawn from official Bangladesh sources and the coordination team’s field experience."
        />

        <GuidePhasesGrid />
        <GuidesSupportCallout />
      </Container>
    </Section>
  )
}
