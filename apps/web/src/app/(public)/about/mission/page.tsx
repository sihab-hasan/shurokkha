import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "Learn why Shurokkha connects communities with trusted disaster support.",
}

export default function OurMissionPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Our Mission" />
        <section className="py-7 sm:py-9">
          <SectionHeader title="People First" align="left" className="mb-0" />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Trusted Information"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Stronger Coordination"
            align="left"
            className="mb-0"
          />
        </section>
      </Container>
    </Section>
  )
}
