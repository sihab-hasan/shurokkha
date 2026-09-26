import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "News",
  description: "Read Shurokkha response, recovery, and community updates.",
}

export default function NewsPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="News and Updates" />
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Response Updates"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Recovery Stories"
            align="left"
            className="mb-0"
          />
        </section>
        <section className="py-7 sm:py-9">
          <SectionHeader title="Platform News" align="left" className="mb-0" />
        </section>
      </Container>
    </Section>
  )
}
