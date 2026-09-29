import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { FundraiseFeed } from "@/features/fundraise/components/fundraise-feed"
import { FundraiseCtaCard } from "@/features/fundraise/components/fundraise-cta-card"

export const metadata: Metadata = {
  title: "Fundraise for relief",
  description:
    "Support verified disaster relief efforts routed through Shurokkha's coordination team.",
}

export default function FundraisePage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="Fundraise for relief"
          title="Support verified disaster relief efforts"
          description="Shurokkha coordinates fundraising against verified need. Contributions are routed through campaigns that the coordination team has approved and tracked end-to-end."
        />

        <FundraiseFeed />
        <FundraiseCtaCard />
      </Container>
    </Section>
  )
}
