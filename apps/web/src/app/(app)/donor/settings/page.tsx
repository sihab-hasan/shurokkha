import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Donor Settings" }
export default function DonorSettingsPage() {
  return (
    <AppCollectionPage
      title="Settings"
      description="Manage donation preferences, receipts, and account notifications."
      items={[
        {
          title: "Donation updates",
          description: "Campaign and delivery notifications are enabled.",
          status: "On",
        },
        {
          title: "Receipt delivery",
          description: "Receipts are sent by email automatically.",
        },
        {
          title: "Public recognition",
          description: "Your donations remain anonymous.",
          status: "Private",
        },
      ]}
      asideTitle="Payment security"
      asideDescription="Saved payment details are protected by the configured payment provider."
    />
  )
}
