import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Disaster Information" }
export default function CitizenDisastersPage() {
  return (
    <AppCollectionPage
      title="Disaster information"
      description="Follow verified disaster updates affecting your region."
      items={[
        {
          title: "Riverside flood response",
          href: "/citizen/disasters/disaster-flood-001",
          description: "Water levels remain elevated across Wards 3 and 4.",
          status: "Active",
        },
        {
          title: "North District landslide risk",
          href: "/citizen/disasters/disaster-landslide-002",
          description: "Residents near unstable slopes should remain alert.",
          status: "Monitoring",
        },
        {
          title: "Monsoon preparedness notice",
          href: "/citizen/disasters/disaster-monsoon-003",
          description: "Review household supplies and evacuation routes.",
          status: "Advisory",
        },
      ]}
      asideTitle="Official information"
      asideDescription="Disaster status and instructions are published by authorized relief officers."
    />
  )
}
