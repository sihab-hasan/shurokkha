import type { Metadata } from "next"

import { AppNotifications } from "@/components/app/app-notifications"

export const metadata: Metadata = { title: "Volunteer Notifications" }

export default function VolunteerNotificationsPage() {
  return (
    <AppNotifications
      description="Assignment, schedule, team, and task-completion updates for your volunteer work."
      items={[
        {
          title: "New mission assigned",
          description: "Riverside evacuation support · Check-in at 10:15 AM",
          unread: true,
        },
        {
          title: "Schedule updated",
          description: "The supply delivery shift now begins at 11:30 AM.",
        },
        {
          title: "Completion confirmed",
          description: "North Ward hygiene-kit delivery was verified.",
        },
      ]}
    />
  )
}
