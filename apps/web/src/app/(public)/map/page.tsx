import type { Metadata } from "next"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"

export const metadata: Metadata = {
  title: "Live Operations Map",
  description:
    "View disasters, emergency alerts, shelters, relief services, and help requests on one live map.",
}

export default function LiveOperationsMapPage() {
  return (
    <ContentContainer className="py-12 sm:py-16 lg:py-20">
      <PageHeader title="Live Operations Map" />
    </ContentContainer>
  )
}
