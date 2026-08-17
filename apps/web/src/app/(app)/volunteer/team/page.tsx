import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "My Response Team" }
export default function VolunteerTeamPage() {
  return (
    <AppCollectionPage
      title="My team"
      description="Coordinate with the response team assigned to your current work."
      items={[
        {
          title: "Rohan Das · Team lead",
          description:
            "Coordinates Riverside distribution and evacuation work.",
          status: "On duty",
        },
        {
          title: "Priya Nair · Logistics",
          description: "Manages resource pickup and delivery confirmation.",
          status: "On duty",
        },
        {
          title: "Maya Patel · Shelter support",
          description: "Coordinates intake assistance at Unity Shelter.",
          status: "Available",
        },
      ]}
      asideTitle="Team boundaries"
      asideDescription="You can view your assigned team but cannot create teams or change assignments."
    />
  )
}
