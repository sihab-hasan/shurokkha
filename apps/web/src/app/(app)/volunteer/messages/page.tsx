import type { Metadata } from "next"

import { AppMessages } from "@/components/app/app-messages"

export const metadata: Metadata = { title: "Volunteer Messages" }

export default function VolunteerMessagesPage() {
  return (
    <AppMessages
      description="Operational messages from your team lead, shelter coordinators, and relief officers."
      items={[
        {
          title: "Team lead briefing",
          href: "/volunteer/messages/conversation-briefing-001",
          description: "Meet Team Alpha at Central Hub by 10:15 AM.",
          unread: true,
        },
        {
          title: "Delivery route updated",
          href: "/volunteer/messages/conversation-route-002",
          description: "Use Hillview Road for the Riverside water delivery.",
        },
        {
          title: "Shelter coordinator message",
          href: "/volunteer/messages/conversation-shelter-003",
          description:
            "Unity Shelter needs intake support tomorrow at 8:00 AM.",
        },
      ]}
      contextTitle="Operational communication"
      contextDescription="Messages are scoped to your assigned team and active tasks."
    />
  )
}
