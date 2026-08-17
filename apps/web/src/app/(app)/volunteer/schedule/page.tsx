import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Volunteer Schedule" }
export default function VolunteerSchedulePage() {
  return (
    <AppCollectionPage
      title="Schedule"
      description="Plan upcoming shifts, briefings, and training sessions."
      items={[
        {
          title: "Community response briefing",
          href: "/volunteer/schedule/shift-briefing-001",
          description: "24 May · 9:00 AM · Central Hub",
          status: "Today",
        },
        {
          title: "Supply delivery shift",
          href: "/volunteer/schedule/shift-delivery-002",
          description: "24 May · 11:30 AM · Riverside",
          status: "Today",
        },
        {
          title: "Shelter support shift",
          href: "/volunteer/schedule/shift-shelter-003",
          description: "25 May · 8:00 AM · Unity Shelter",
          status: "Upcoming",
        },
      ]}
      asideTitle="Availability"
      asideDescription="Keep your available hours current so coordinators can assign suitable work."
    />
  )
}
