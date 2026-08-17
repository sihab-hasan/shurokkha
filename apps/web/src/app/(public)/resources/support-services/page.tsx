import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Support Services",
  description:
    "Find coordinated disaster support services and recovery assistance.",
}

export default function SupportServicesPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Support Services" />
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Emergency Assistance"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Food and Supplies"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Medical Support" align="left" className="mb-0" />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Recovery Support" align="left" className="mb-0" />
      </section>
    </ContentContainer>
  )
}
