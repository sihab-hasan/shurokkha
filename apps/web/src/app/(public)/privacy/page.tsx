import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Shurokkha handles personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Privacy Policy" />
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Information We Collect"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="How Information Is Used"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Information Sharing"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Your Choices" align="left" className="mb-0" />
      </section>
    </ContentContainer>
  )
}
