import type { Metadata } from "next"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"

export const metadata: Metadata = {
  title: "Live Operations Map",
  description:
    "View disasters, emergency alerts, shelters, relief services, and help requests on one live map.",
}

export default function LiveOperationsMapPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <PageHeader title="Live Operations Map" />
      </Container>
    </Section>
  )
}
