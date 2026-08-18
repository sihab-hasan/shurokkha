import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Request Emergency Help" }
export default function RequestHelpPage() {
  return (
    <AppCollectionPage
      title="Request emergency help"
      description="Choose the type of assistance you need and provide your current location."
      items={[
        {
          title: "Rescue needed",
          description: "Request urgent evacuation from an unsafe location.",
          status: "Critical",
        },
        {
          title: "Medical emergency",
          description: "Request immediate medical support or transport.",
          status: "Critical",
        },
        {
          title: "Food, water, or medicine",
          description: "Report an urgent shortage of essential supplies.",
          status: "High",
        },
        {
          title: "Temporary shelter",
          description: "Request safe accommodation for your household.",
          status: "High",
        },
      ]}
      asideTitle="Emergency information"
      asideDescription="Include an accurate location, contact number, urgency, and number of affected people."
    />
  )
}
