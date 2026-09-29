import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { VolunteerApplicationClient } from "./_components/volunteer-application-client"

export default function VolunteerApplicationPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="max-w-2xl space-y-6">
        <PageHeader
          title="Volunteer Onboarding Application"
          description="Tell us about your skills and availability. The coordination team will review and respond."
        />
        <VolunteerApplicationClient />
      </Container>
    </Section>
  )
}
