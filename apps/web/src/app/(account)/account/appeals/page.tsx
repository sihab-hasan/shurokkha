import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { AppealsClient } from "./_components/appeals-client"

export default function AppealsPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Appeals Management"
          description="File an appeal against an assistance, missing person, or help request decision."
        />
        <AppealsClient />
      </Container>
    </Section>
  )
}
