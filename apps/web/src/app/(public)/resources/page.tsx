import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Find verified emergency supplies, services, and disaster relief resources.",
}

export default function ResourcesPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Resources" />
        <section className="py-7 sm:py-9">
          <SectionHeader
            title="Resource Browser"
            align="left"
            className="mb-0"
          />
        </section>
      </Container>
    </Section>
  )
}
