import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { AssistanceRequestForm } from "@/features/assistance"

export default function NewAssistancePage() {
  return (
    <Section className="space-y-6">
      <Container padded={false}>
        <PageHeader title="Request emergency help" />
        <AssistanceRequestForm />
      </Container>
    </Section>
  )
}
