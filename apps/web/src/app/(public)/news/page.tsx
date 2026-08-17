import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "News",
  description: "Read Shurokkha response, recovery, and community updates.",
}

export default function NewsPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="News and Updates" />
      <section className="py-7 sm:py-9">
        <SectionHeader title="Response Updates" align="left" className="mb-0" />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Recovery Stories" align="left" className="mb-0" />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Platform News" align="left" className="mb-0" />
      </section>
    </ContentContainer>
  )
}
