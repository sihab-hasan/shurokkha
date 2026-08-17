import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Shurokkha accessibility commitment and support.",
}

export default function AccessibilityPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
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
    </ContentContainer>
  )
}
