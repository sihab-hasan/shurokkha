import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "Emergency Alerts",
  description:
    "View timely emergency alerts and safety information for disaster-affected communities.",
}

export default function EmergencyAlertsPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Emergency Alerts" />
        <section className="py-7 sm:py-9">
          <SectionHeader title="Alert Results" align="left" className="mb-0" />
        </section>
      </Container>
    </Section>
  )
}
