import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Shurokkha accessibility commitment and support.",
}

export default function AccessibilityPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Accessibility" />
        <section className="py-7 sm:py-9">
          <SectionHeader title="Our Commitment" align="left" className="mb-0" />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Ongoing Improvement"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Request Assistance"
            align="left"
            className="mb-0"
          />
        </section>
      </Container>
    </Section>
  )
}
