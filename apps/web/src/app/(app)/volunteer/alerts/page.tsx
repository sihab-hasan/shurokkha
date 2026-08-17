import type { Metadata } from "next"

import { AppCollectionPage } from "@/components/app/app-collection-page"

export const metadata: Metadata = { title: "Emergency Alerts" }

export default function VolunteerAlertsPage() {
  return (
    <AppCollectionPage
      title="Emergency alerts"
      description="Read verified safety warnings that affect your assigned missions, routes, and shelters."
      items={[
        {
          title: "Riverside route restriction",
          href: "/volunteer/alerts/alert-route-001",
          description:
            "Use Hillview Road for all supply deliveries until further notice.",
          status: "Urgent",
        },
        {
          title: "Heavy rainfall warning",
          href: "/volunteer/alerts/alert-rainfall-002",
          description:
            "Field teams should avoid low-lying areas after 6:00 PM.",
          status: "Active",
        },
        {
          title: "Unity Shelter capacity update",
          href: "/volunteer/alerts/alert-capacity-003",
          description:
            "Intake support remains active while occupancy is reviewed.",
          status: "Updated",
        },
      ]}
      asideTitle="Volunteer safety"
      asideDescription="Follow team-lead instructions and do not enter restricted areas without clearance."
    />
  )
}
