import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { FundraiseCtaCard } from "@/features/fundraise/components/fundraise-cta-card"
import { FundraiseStepsGrid } from "@/features/fundraise/components/fundraise-steps-grid"

export const metadata: Metadata = {
  title: "Fundraise for relief",
  description:
    "Support verified disaster relief efforts routed through Shurokkha’s coordination team.",
}

/**
 * `/fundraise` shell. Page-level composition: header → steps grid
 * → CTA banner. Static today; a future live campaign feed can
 * replace the grid without touching this file.
 */
export default function FundraisePage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="Fundraise for relief"
          title="Support verified disaster relief efforts"
          description="Shurokkha coordinates fundraising against verified need. Contributions are routed through campaigns that the coordination team has approved and tracked end-to-end."
        />

        <FundraiseStepsGrid />
        <FundraiseCtaCard />
      </Container>
    </Section>
  )
}
