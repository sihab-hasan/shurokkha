import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Donation Receipts" }
export default function DonationReceiptsPage() {
  return (
    <AppCollectionPage
      title="Receipts"
      description="Access verified acknowledgements for your completed donations."
      items={[
        {
          title: "Receipt DR-2048",
          href: "/donor/receipts/receipt-2048",
          description: "Flood recovery fund · $1,200 · 20 May",
          status: "Available",
        },
        {
          title: "Receipt DR-2011",
          href: "/donor/receipts/receipt-2011",
          description: "Emergency food packs · $640 · 18 May",
          status: "Available",
        },
        {
          title: "Receipt DR-1954",
          href: "/donor/receipts/receipt-1954",
          description: "Medical supply drive · $1,000 · 12 May",
          status: "Available",
        },
      ]}
      asideTitle="Acknowledgements"
      asideDescription="Receipts identify the campaign and amount without exposing beneficiary information."
    />
  )
}
