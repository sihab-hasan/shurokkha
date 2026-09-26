import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "Transparency",
  description:
    "Learn how Shurokkha approaches verification, accountability, and trust.",
}

export default function TransparencyPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Transparency" />
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Verified Information"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Campaign Accountability"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Responsible Updates"
            align="left"
            className="mb-0"
          />
        </section>
      </Container>
    </Section>
  )
}
