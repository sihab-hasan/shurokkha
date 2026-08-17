import type { Metadata } from "next"

import { AppCollectionPage } from "@/components/app/app-collection-page"

export const metadata: Metadata = { title: "Emergency Alerts" }

export default function DonorAlertsPage() {
  return (
    <AppCollectionPage
      title="Emergency alerts"
      description="Read verified disaster warnings and relief priorities that may affect active campaigns."
      items={[
        {
          title: "Heavy rainfall warning",
          href: "/donor/alerts/alert-rainfall-001",
          description:
            "Flood risk remains elevated across Riverside Wards 3 and 4.",
          status: "Urgent",
        },
        {
          title: "Emergency food shortage",
          href: "/donor/alerts/alert-food-002",
          description:
            "North Ward shelters require additional family food packs.",
          status: "High priority",
        },
        {
          title: "Medical supplies requested",
          href: "/donor/alerts/alert-medical-003",
          description:
            "Riverside Clinic has published a verified restocking requirement.",
          status: "Active",
        },
      ]}
      asideTitle="Read-only access"
      asideDescription="Donors can review verified alerts but cannot create or modify emergency notices."
    />
  )
}
