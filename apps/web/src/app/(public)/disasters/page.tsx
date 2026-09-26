import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "Disasters",
  description:
    "Track current and recent disasters, affected areas, and official situation updates.",
}

export default function DisastersPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Disasters" />
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Disaster Results"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader title="Preparedness" align="left" className="mb-0" />
        </section>
      </Container>
    </Section>
  )
}
