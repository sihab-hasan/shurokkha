import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Contributions" }
export default function DonorContributionsPage() {
  return (
    <AppCollectionPage
      title="Contributions"
      description="Review your donation history and fulfillment status."
      items={[
        {
          title: "Flood recovery fund · $1,200",
          href: "/donor/contributions/contribution-flood-001",
          description: "20 May · Distributed across 18 households",
          status: "Complete",
        },
        {
          title: "Emergency food packs · $640",
          href: "/donor/contributions/contribution-food-002",
          description: "18 May · Delivery is in transit",
          status: "In transit",
        },
        {
          title: "Medical supply drive · $1,000",
          href: "/donor/contributions/contribution-medical-003",
          description: "12 May · Received by Riverside Clinic",
          status: "Delivered",
        },
      ]}
      asideTitle="Receipts"
      asideDescription="Verified contribution receipts remain available in your account history."
    />
  )
}
