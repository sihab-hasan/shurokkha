import type { Metadata } from "next"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"
import { OperationsDashboard } from "@/features/operations"

export const metadata: Metadata = {
  title: "Response Operations & Team Management",
  description:
    "Direct lab management console for affected areas, rescue teams, and team assignment operations.",
}

export default function OperationsPage() {
  return (
    <Section className="py-8 sm:py-12">
      <Container className="space-y-8">
        <OperationsDashboard />
      </Container>
    </Section>
  )
}
