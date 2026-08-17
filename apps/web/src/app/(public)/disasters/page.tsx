import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Disasters",
  description:
    "Track current and recent disasters, affected areas, and official situation updates.",
}

export default function DisastersPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Disasters" />
      <section className="py-7 sm:py-9">
        <SectionHeader title="Disaster Results" align="left" className="mb-0" />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Preparedness" align="left" className="mb-0" />
      </section>
    </ContentContainer>
  )
}
