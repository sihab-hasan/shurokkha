import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { VolunteerExistingBanner } from "@/features/volunteers/components/volunteer-existing-banner"
import { VolunteerOpportunitiesTable } from "@/features/volunteers/components/volunteer-opportunities-table"
import { VolunteerRolesGrid } from "@/features/volunteers/components/volunteer-roles-grid"

export const metadata: Metadata = {
  title: "Volunteer with Shurokkha",
  description:
    "Join Shurokkha as a field volunteer, skilled responder, or community lead to help communities prepare, respond, and recover.",
}

/**
 * `/volunteers` shell. Page-level composition: header → roles grid
 * → opportunities table → existing-volunteer banner.
 */
export default function VolunteersPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="Volunteer with Shurokkha"
          title="Help communities prepare, respond, and recover"
          description="Whether you can give two hours a week or join an active response, Shurokkha keeps volunteer participation coordinated, transparent, and matched to verified need."
        />

        <VolunteerRolesGrid />
        <VolunteerOpportunitiesTable />
        <VolunteerExistingBanner />
      </Container>
    </Section>
  )
}