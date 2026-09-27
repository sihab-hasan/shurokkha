import type { Metadata } from "next"

import { AlertClarificationCallout } from "@/features/alerts/components/alert-clarification-callout"
import { AlertsSourceGrid } from "@/features/alerts/components/alerts-source-grid"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

export const metadata: Metadata = {
  title: "Emergency alerts",
  description:
    "Verified Bangladesh emergency alerts, official helplines, and trusted information sources during disasters.",
}

/**
 * `/emergency-alerts` shell. Page-level composition: header → sources
 * grid → clarification callout. Static; no data hook.
 */
export default function EmergencyAlertsPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="Emergency alerts"
          title="Verified alerts and trusted information sources"
          description="Shurokkha surfaces coordination context — official Bangladesh helplines, government advisories, and live disaster status — so people can verify what they hear before acting on it."
        />

        <AlertsSourceGrid />
        <AlertClarificationCallout />
      </Container>
    </Section>
  )
}
