import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Nearby Shelters" }
export default function CitizenSheltersPage() {
  return (
    <AppCollectionPage
      title="Nearby shelters"
      description="Find verified emergency accommodation and current capacity."
      items={[
        {
          title: "Unity Community Shelter",
          href: "/citizen/shelters/shelter-unity-001",
          description: "1.2 km away · 24 beds available",
          status: "Open",
        },
        {
          title: "Riverside School Hall",
          href: "/citizen/shelters/shelter-riverside-002",
          description: "2.8 km away · 11 spaces available",
          status: "Open",
        },
        {
          title: "North Ward Relief Centre",
          href: "/citizen/shelters/shelter-north-003",
          description: "4.1 km away · Medical desk available",
          status: "Limited",
        },
      ]}
      asideTitle="Before you travel"
      asideDescription="Confirm capacity and carry identification and essential medication."
    />
  )
}
