import type { Metadata } from "next"

import { AppMessages } from "@/components/app/app-messages"

export const metadata: Metadata = { title: "Citizen Messages" }

export default function CitizenMessagesPage() {
  return (
    <AppMessages
      description="Messages from verified relief officers and response teams about your requests."
      items={[
        {
          title: "Field officer assigned",
          href: "/citizen/messages/conversation-officer-001",
          description:
            "Officer Rahman will contact you regarding your medical request.",
          unread: true,
        },
        {
          title: "Shelter reservation confirmed",
          href: "/citizen/messages/conversation-shelter-002",
          description: "Unity Shelter has reserved space for your household.",
        },
        {
          title: "Pickup instructions",
          href: "/citizen/messages/conversation-pickup-003",
          description:
            "Collect your food pack from Central Hub before 6:00 PM.",
        },
      ]}
      contextTitle="Safe communication"
      contextDescription="Messages are limited to your own requests and verified relief activity."
    />
  )
}
