import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Volunteer Settings" }
export default function VolunteerSettingsPage() {
  return (
    <AppCollectionPage
      title="Settings"
      description="Manage availability, assignment alerts, and volunteer account preferences."
      items={[
        {
          title: "Assignment notifications",
          description: "Push and SMS notifications are enabled.",
          status: "On",
        },
        {
          title: "Weekly availability",
          description: "Monday to Saturday · 8:00 AM–6:00 PM",
        },
        {
          title: "Travel radius",
          description: "Assignments within 15 km of Riverside.",
        },
      ]}
      asideTitle="Emergency contact"
      asideDescription="Keep your emergency contact information current before field deployment."
    />
  )
}
