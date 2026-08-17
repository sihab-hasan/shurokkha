import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Emergency Alerts",
  description:
    "View timely emergency alerts and safety information for disaster-affected communities.",
}

export default function EmergencyAlertsPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Emergency Alerts" />
      <section className="py-7 sm:py-9">
        <SectionHeader title="Alert Results" align="left" className="mb-0" />
      </section>
    </ContentContainer>
  )
}
