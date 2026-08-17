import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Relief Campaigns" }
export default function DonorCampaignsPage() {
  return (
    <AppCollectionPage
      title="Campaigns"
      description="Follow active relief campaigns and urgent funding needs."
      items={[
        {
          title: "Rebuild Riverside homes",
          href: "/donor/campaigns/campaign-riverside-001",
          description: "$36,000 of $50,000 raised · 8 days remaining",
          status: "Active",
        },
        {
          title: "Monsoon readiness kits",
          href: "/donor/campaigns/campaign-monsoon-002",
          description: "$18,400 of $30,000 raised · 16 days remaining",
          status: "Active",
        },
        {
          title: "Mobile medical unit",
          href: "/donor/campaigns/campaign-medical-003",
          description: "$42,100 of $45,000 raised · 3 days remaining",
          status: "Nearly funded",
        },
      ]}
      asideTitle="Campaign verification"
      asideDescription="Funding targets are reviewed against confirmed response requirements."
    />
  )
}
