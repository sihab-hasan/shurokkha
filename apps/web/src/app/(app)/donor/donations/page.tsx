import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "My Donations" }
export default function DonorDonationsPage() {
  return (
    <AppCollectionPage
      title="My donations"
      description="Review only the financial and material donations associated with your account."
      items={[
        {
          title: "Flood recovery fund · $1,200",
          href: "/donor/donations/donation-flood-001",
          description: "Donated 20 May · Receipt DR-2048",
          status: "Distributed",
        },
        {
          title: "Emergency food packs · $640",
          href: "/donor/donations/donation-food-002",
          description: "Donated 18 May · Receipt DR-2011",
          status: "In transit",
        },
        {
          title: "Medical supply drive · $1,000",
          href: "/donor/donations/donation-medical-003",
          description: "Donated 12 May · Receipt DR-1954",
          status: "Delivered",
        },
      ]}
      asideTitle="Private donation history"
      asideDescription="Other donors cannot view your identity, receipts, or contribution records."
    />
  )
}
