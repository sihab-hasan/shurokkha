import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Donation Tracking" }
export default function DonationTrackingPage() {
  return (
    <AppCollectionPage
      title="Donation tracking"
      description="Follow verified movement and distribution updates for your donations."
      items={[
        {
          title: "Food packs: Central Warehouse → Riverside Camp",
          href: "/donor/tracking/tracking-food-001",
          description: "Loaded for delivery at 8:40 AM today.",
          status: "In transit",
        },
        {
          title: "Medical supplies: Riverside Clinic",
          href: "/donor/tracking/tracking-medical-002",
          description: "Received and verified by the responsible officer.",
          status: "Delivered",
        },
        {
          title: "Shelter repair fund: Unity Shelter",
          href: "/donor/tracking/tracking-shelter-003",
          description: "Allocated to approved repair work.",
          status: "Allocated",
        },
      ]}
      asideTitle="Transparent distribution"
      asideDescription="Tracking events are added after warehouse, delivery, or officer confirmation."
    />
  )
}
