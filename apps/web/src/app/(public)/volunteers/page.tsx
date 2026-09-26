import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "Volunteers",
  description:
    "Join Shurokkha volunteers and help communities prepare, respond, and recover from disasters.",
}

export default function VolunteersPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Volunteers" />
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Urgent Opportunities"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Volunteer Roles"
            align="left"
            className="mb-0"
          />
        </section>
      </Container>
    </Section>
  )
}
