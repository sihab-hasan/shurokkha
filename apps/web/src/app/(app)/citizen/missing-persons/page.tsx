import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Missing Persons" }
export default function CitizenMissingPersonsPage() {
  return (
    <AppCollectionPage
      title="Missing persons"
      description="Submit and follow missing-person reports connected to an active disaster."
      items={[
        {
          title: "Report a missing person",
          href: "/citizen/missing-persons/create",
          description:
            "Provide a name, recent photograph, age, and last known location.",
        },
        {
          title: "My submitted reports",
          href: "/citizen/missing-persons/report-submitted-001",
          description: "Review status updates from authorized response teams.",
          status: "Private",
        },
        {
          title: "Recently located people",
          href: "/citizen/missing-persons/report-located-002",
          description:
            "View public notices approved by investigating officers.",
          status: "Verified",
        },
      ]}
      asideTitle="Protect personal data"
      asideDescription="Contact and identification details are visible only to authorized personnel."
    />
  )
}
