import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Citizen Settings" }
export default function CitizenSettingsPage() {
  return (
    <AppCollectionPage
      title="Settings"
      description="Manage notifications, location preferences, and account access."
      items={[
        {
          title: "Emergency notifications",
          description: "SMS and push alerts are enabled.",
          status: "On",
        },
        { title: "Preferred location", description: "Riverside, Ward 4" },
        { title: "Language", description: "English" },
      ]}
      asideTitle="Account security"
      asideDescription="Review sign-in activity and update your password regularly."
    />
  )
}
