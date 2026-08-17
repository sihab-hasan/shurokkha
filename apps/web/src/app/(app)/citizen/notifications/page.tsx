import type { Metadata } from "next"

import { AppNotifications } from "@/components/app/app-notifications"

export const metadata: Metadata = { title: "Citizen Notifications" }

export default function CitizenNotificationsPage() {
  return (
    <AppNotifications
      description="Updates about your requests, shelter matches, and local relief services."
      items={[
        {
          title: "Medical request assigned",
          description: "A field response team was assigned 18 minutes ago.",
          unread: true,
        },
        {
          title: "Food pack ready",
          description: "Your emergency food pack is ready at Central Hub.",
        },
        {
          title: "Shelter match confirmed",
          description:
            "A place is reserved for your household at Unity Shelter.",
        },
      ]}
    />
  )
}
