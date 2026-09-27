import type { Metadata } from "next"

import { Card, CardContent } from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

import { DonateGate } from "@/features/donations/components/donate-gate"

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support disaster relief efforts by donating funds and essential resources through Shurokkha.",
}

const HIGHLIGHTS = [
  {
    title: "Pick where it goes",
    body: "Target a verified campaign or give to the general relief pool — Shurokkha's coordination team routes every contribution to where it's needed most.",
  },
  {
    title: "A receipt you can keep",
    body: "Every donation gets a unique receipt number you can reference later. The status moves from pending to completed once we've processed your payment.",
  },
  {
    title: "Pay your way",
    body: "bKash, Nagad, Rocket, bank transfer, or card — whichever works for you. Don't have a method handy yet? You can decide later from your account.",
  },
]

export default function DonatePage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          title="Donate to Shurokkha relief"
          description="Every contribution — large or small — helps responders reach the next household in need. Pick a campaign, an amount, and a way to pay."
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <SectionHeader
                title="Make a donation"
                description="The form below submits to your account dashboard so we can issue a receipt."
                align="left"
                className="mb-0"
              />
              <div className="mt-6">
                <DonateGate />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {HIGHLIGHTS.map((item) => (
              <Card key={item.title}>
                <CardContent className="space-y-2 p-6">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
