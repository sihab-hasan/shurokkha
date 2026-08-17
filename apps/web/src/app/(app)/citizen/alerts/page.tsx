import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Emergency Alerts" }
export default function CitizenAlertsPage() {
  return (
    <AppCollectionPage
      title="Emergency alerts"
      description="Verified safety notices affecting your selected area."
      items={[
        {
          title: "Heavy rainfall warning",
          href: "/citizen/alerts/alert-rainfall-001",
          description: "Avoid low-lying roads after 6:00 PM today.",
          status: "Urgent",
        },
        {
          title: "Riverside road closure",
          href: "/citizen/alerts/alert-road-002",
          description: "Use the Hillview route until further notice.",
          status: "Active",
        },
        {
          title: "Water distribution point",
          href: "/citizen/alerts/alert-water-003",
          description: "Clean water is available at Central Hub.",
          status: "Updated",
        },
      ]}
      asideTitle="Stay informed"
      asideDescription="Follow official instructions and keep your emergency contacts available."
    />
  )
}
