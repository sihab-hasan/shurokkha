import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Shelters",
  description:
    "Locate available emergency shelters and essential services near affected areas.",
}

export default function SheltersPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Shelters" />
      <section className="py-7 sm:py-9">
        <SectionHeader title="Shelter Browser" align="left" className="mb-0" />
      </section>
    </ContentContainer>
  )
}
