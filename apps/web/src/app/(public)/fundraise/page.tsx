import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Fundraise",
  description:
    "Organize responsible fundraising for verified disaster relief efforts.",
}

export default function FundraisePage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Fundraise for Relief" />
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Choose a Campaign"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Share Responsibly"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Track the Impact" align="left" className="mb-0" />
      </section>
    </ContentContainer>
  )
}
