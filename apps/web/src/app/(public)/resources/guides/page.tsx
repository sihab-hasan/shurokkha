import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "Emergency Guides",
  description:
    "Practical guidance for preparing for and responding to disasters.",
}

export default function EmergencyGuidesPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Emergency Guides" />
        <section className="py-7 sm:py-9">
          <SectionHeader title="Prepare" align="left" className="mb-0" />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader title="Respond" align="left" className="mb-0" />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader title="Evacuate" align="left" className="mb-0" />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader title="Recover" align="left" className="mb-0" />
        </section>
      </Container>
    </Section>
  )
}
