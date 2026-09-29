import type { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

import { TransparencyLiveStats } from "./_components/transparency-live-stats"
import { TransparencyRecentCampaigns } from "./_components/transparency-recent-campaigns"

export const metadata: Metadata = {
  title: "Transparency",
  description:
    "How Shurokkha approaches verification, accountability, and trust — with live platform metrics.",
}

export default function TransparencyPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="Transparency"
          title="Verification, accountability, and live platform metrics"
          description="Shurokkha is built around three promises: verified information, accountable campaigns, and responsible updates. Every metric below is sourced live from the public API."
        />

        <TransparencyLiveStats />

        <section className="space-y-4">
          <SectionHeader
            title="Verified Information"
            description="All disaster, shelter, and alert data is reviewed against official sources before publication. The figures above show only entries the coordination team has confirmed."
            align="left"
            className="mb-0"
          />
          <Card>
            <CardContent className="space-y-2 p-6 text-sm text-muted-foreground">
              <p>
                We pair every public record with a verifiable source: government
                advisories, partner NGOs, or on-the-ground volunteer reports
                that have been cross-checked.
              </p>
              <p>
                Records marked <span className="font-semibold">verified</span>{" "}
                are surfaced in the live feeds. Pending records stay in the
                coordination queue until reviewed.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Campaign Accountability"
            description="Every fundraise links to a coordinator-approved goal and shows live progress."
            align="left"
            className="mb-0"
          />
          <TransparencyRecentCampaigns />
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Responsible Updates"
            align="left"
            className="mb-0"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Source-first</CardTitle>
                <CardDescription>
                  Every status update links to a primary source.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                If we can&apos;t verify a number, we don&apos;t publish it.
                Unverified reports go to the coordination queue first.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Right to reply</CardTitle>
                <CardDescription>
                  Anyone affected can submit feedback or a complaint.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                The platform includes complaint and feedback channels under{" "}
                <code className="rounded bg-muted px-1">/account</code>. We
                respond within the SLA published in our response policy.
              </CardContent>
            </Card>
          </div>
        </section>
      </Container>
    </Section>
  )
}
