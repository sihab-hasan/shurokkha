import type { Metadata } from "next"

import { AppMessages } from "@/components/app/app-messages"

export const metadata: Metadata = { title: "Donor Messages" }

export default function DonorMessagesPage() {
  return (
    <AppMessages
      description="Verified messages about your contributions, receipts, and supported campaigns."
      items={[
        {
          title: "Distribution acknowledgement",
          href: "/donor/messages/conversation-distribution-001",
          description:
            "Riverside Clinic confirmed receipt of your medical-supply donation.",
          unread: true,
        },
        {
          title: "Campaign coordinator update",
          href: "/donor/messages/conversation-campaign-002",
          description:
            "Riverside flood recovery has reached its latest funding milestone.",
        },
        {
          title: "Receipt available",
          href: "/donor/messages/conversation-receipt-003",
          description: "Your receipt DR-2048 is ready to review.",
        },
      ]}
      contextTitle="Private correspondence"
      contextDescription="Messages never expose beneficiary or other donor information."
    />
  )
}
