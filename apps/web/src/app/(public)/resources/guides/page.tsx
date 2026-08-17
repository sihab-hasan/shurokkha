import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Emergency Guides",
  description:
    "Practical guidance for preparing for and responding to disasters.",
}

export default function EmergencyGuidesPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Emergency Guides" />
      <section className="py-7 sm:py-9">
        <SectionHeader title="Prepare" align="left" className="mb-0" />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Respond" align="left" className="mb-0" />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Evacuate" align="left" className="mb-0" />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Recover" align="left" className="mb-0" />
      </section>
    </ContentContainer>
  )
}
