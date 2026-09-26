import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support disaster relief efforts by donating funds and essential resources through Shurokkha.",
}

export default function DonatePage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Donate" />
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Verified Campaigns"
            align="left"
            className="mb-0"
          />
        </section>
      </Container>
    </Section>
  )
}
