import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of Shurokkha services.",
}

export default function TermsOfUsePage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Terms of Use" />
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Responsible Use"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Emergency Limitations"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader title="User Content" align="left" className="mb-0" />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Service Changes"
            align="left"
            className="mb-0"
          />
        </section>
      </Container>
    </Section>
  )
}
