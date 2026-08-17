import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Make a Donation" }
export default function DonorDonatePage() {
  return (
    <AppCollectionPage
      title="Make a donation"
      description="Choose a verified relief priority to support."
      items={[
        {
          title: "Riverside flood recovery",
          description: "Help families repair homes and replace essentials.",
          status: "72% funded",
        },
        {
          title: "Emergency food packs",
          description: "Provide seven days of food for displaced households.",
          status: "Urgent",
        },
        {
          title: "Medical supply reserve",
          description: "Restock first-aid and essential clinical supplies.",
          status: "58% funded",
        },
      ]}
      asideTitle="Secure giving"
      asideDescription="Every campaign is verified before it can receive donations."
    />
  )
}
