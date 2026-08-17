import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support disaster relief efforts by donating funds and essential resources through Shurokkha.",
}

export default function DonatePage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Donate" />
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Verified Campaigns"
          align="left"
          className="mb-0"
        />
      </section>
    </ContentContainer>
  )
}
