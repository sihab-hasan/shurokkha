import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { GetHelpNextSteps } from "@/features/get-help/components/get-help-next-steps"
import { GetHelpPrivacyCard } from "@/features/get-help/components/get-help-privacy-card"
import { GetHelpRequestCard } from "@/features/get-help/components/get-help-request-card"
import { GetHelpWarningBanner } from "@/features/get-help/components/get-help-warning-banner"
import { CitizenEmergencyHistory } from "@/features/assistance/components/citizen-emergency-history"
import { QuickDisasterTransactionCard } from "@/features/assistance/components/quick-disaster-transaction-card"

export const metadata: Metadata = {
  title: "Get help",
  description:
    "Request verified disaster assistance from the Shurokkha coordination team.",
}

/**
 * `/get-help` shell. Page-level composition: header → warning banner
 * → request card + privacy card → atomic transaction card → CitizenEmergencyHistory → next-steps panel.
 */
export default function GetHelpPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="Get help"
          title="Request verified disaster assistance"
          description="Submitting a request through Shurokkha routes your situation to the coordination team so the response can be matched to verified context."
        />

        <GetHelpWarningBanner />

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <GetHelpRequestCard />
          <GetHelpPrivacyCard />
        </div>

        <QuickDisasterTransactionCard />

        <CitizenEmergencyHistory />

        <GetHelpNextSteps />
      </Container>
    </Section>
  )
}
