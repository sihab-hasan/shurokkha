import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { MissingPersonForm } from "@/features/missing-persons"

export default function NewMissingPersonPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false}>
        <PageHeader title="Report a missing person" />
        <MissingPersonForm />
      </Container>
    </Section>
  )
}
