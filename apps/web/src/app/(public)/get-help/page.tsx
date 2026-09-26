import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "Get Help",
  description:
    "Request emergency assistance and find immediate disaster relief support through Shurokkha.",
}

export default function GetHelpPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Get Help" />
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Emergency Warning"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Request Help Form"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="What Happens Next"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader title="Privacy Notice" align="left" className="mb-0" />
        </section>
      </Container>
    </Section>
  )
}
