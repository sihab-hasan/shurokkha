import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { HouseholdClient } from "./_components/household-client"

export default function HouseholdPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Household & Family Roster"
          description="One household per user. Track head-of-household contact, address, and individual members for targeted relief."
        />
        <HouseholdClient />
      </Container>
    </Section>
  )
}
