import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Distribution Tasks" }
export default function VolunteerDistributionsPage() {
  return (
    <AppCollectionPage
      title="Distribution tasks"
      description="Deliver assigned relief resources and update completion status."
      items={[
        {
          title: "50 drinking-water packs",
          href: "/volunteer/distributions/distribution-water-001",
          description: "Central Hub → Riverside Ward 4 · Due 11:30 AM",
          status: "Next",
        },
        {
          title: "30 family food kits",
          href: "/volunteer/distributions/distribution-food-002",
          description: "District Camp → Unity Shelter · Due 3:00 PM",
          status: "Assigned",
        },
        {
          title: "12 hygiene kits",
          href: "/volunteer/distributions/distribution-hygiene-003",
          description: "Delivered to North Ward Relief Centre.",
          status: "Complete",
        },
      ]}
      asideTitle="Delivery confirmation"
      asideDescription="Confirm quantity and destination with the receiving officer before completion."
    />
  )
}
