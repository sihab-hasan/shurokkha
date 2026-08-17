import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Find verified emergency supplies, services, and disaster relief resources.",
}

export default function ResourcesPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Resources" />
      <section className="py-7 sm:py-9">
        <SectionHeader title="Resource Browser" align="left" className="mb-0" />
      </section>
    </ContentContainer>
  )
}
