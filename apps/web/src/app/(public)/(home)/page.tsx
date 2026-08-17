import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Shurokkha coordinates emergency response, shelters, volunteers, donations, and critical resources during disasters.",
}

export default function HomePage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Home" />
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Emergency Actions"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Active Alerts and Disasters"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader title="Nearby Shelters" align="left" className="mb-0" />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="How Shurokkha Works"
          align="left"
          className="mb-0"
        />
      </section>
      <section className="py-7 sm:py-9">
        <SectionHeader
          title="Volunteer and Donation CTA"
          align="left"
          className="mb-0"
        />
      </section>
    </ContentContainer>
  )
}
