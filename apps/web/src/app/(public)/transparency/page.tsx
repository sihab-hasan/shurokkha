import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Transparency",
  description:
    "Learn how Shurokkha approaches verification, accountability, and trust.",
}

export default function TransparencyPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Transparency" />
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Verified Information"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Campaign Accountability"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Responsible Updates"
          align="left"
          className="mb-0"
        />
      </section>
    </ContentContainer>
  )
}
