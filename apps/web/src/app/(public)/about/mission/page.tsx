import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "Learn why Shurokkha connects communities with trusted disaster support.",
}

export default function OurMissionPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Our Mission" />
      <section className="py-7 sm:py-9">
        <SectionHeader title="People First" align="left" className="mb-0" />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Trusted Information"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Stronger Coordination"
          align="left"
          className="mb-0"
        />
      </section>
    </ContentContainer>
  )
}
