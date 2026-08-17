import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Volunteers",
  description:
    "Join Shurokkha volunteers and help communities prepare, respond, and recover from disasters.",
}

export default function VolunteersPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Volunteers" />
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Urgent Opportunities"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Volunteer Roles" align="left" className="mb-0" />
      </section>
    </ContentContainer>
  )
}
