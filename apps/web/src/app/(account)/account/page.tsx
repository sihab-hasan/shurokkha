import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import {
  DashboardActivitySection,
  DashboardStatsSection,
} from "@/features/dashboard"

export default function AccountDashboardPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false}>
        <PageHeader title="Account Dashboard" />
      </Container>

      <Container padded={false}>
        <DashboardStatsSection />
      </Container>

      <Container padded={false}>
        <DashboardActivitySection />
      </Container>
    </Section>
  )
}
