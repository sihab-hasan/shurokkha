import type { Metadata } from "next"

import { AppNotifications } from "@/components/app/app-notifications"

export const metadata: Metadata = { title: "Donor Notifications" }

export default function DonorNotificationsPage() {
  return (
    <AppNotifications
      description="Updates about your donations, receipts, campaigns, and verified distribution activity."
      items={[
        {
          title: "Donation delivered",
          description: "Medical supplies reached Riverside Clinic.",
          unread: true,
        },
        {
          title: "Receipt generated",
          description: "Receipt DR-2048 is now available.",
        },
        {
          title: "Campaign milestone reached",
          description: "Riverside flood recovery is now 72% funded.",
        },
      ]}
    />
  )
}
