import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Assigned Shelters" }
export default function VolunteerSheltersPage() {
  return (
    <AppCollectionPage
      title="Assigned shelters"
      description="View shelters connected to your current volunteer assignments."
      items={[
        {
          title: "Unity Community Shelter",
          href: "/volunteer/shelters/shelter-unity-001",
          description: "Intake support · 24 beds available",
          status: "Assigned",
        },
        {
          title: "Riverside School Hall",
          href: "/volunteer/shelters/shelter-riverside-002",
          description: "Food distribution · 11 spaces available",
          status: "Today",
        },
        {
          title: "North Ward Relief Centre",
          href: "/volunteer/shelters/shelter-north-003",
          description: "Medical desk support · Tomorrow at 8:00 AM",
          status: "Upcoming",
        },
      ]}
      asideTitle="Volunteer access"
      asideDescription="Occupant personal records remain restricted to authorized shelter personnel."
    />
  )
}
