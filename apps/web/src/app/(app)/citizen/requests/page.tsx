import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "My Requests" }
export default function CitizenRequestsPage() {
  return (
    <AppCollectionPage
      title="My requests"
      description="Track assistance requests and their current response status."
      items={[
        {
          title: "Medical assistance",
          href: "/citizen/requests/request-medical-001",
          description: "A response team has been assigned to your request.",
          status: "In progress",
        },
        {
          title: "Emergency food pack",
          href: "/citizen/requests/request-food-002",
          description: "Your package is ready at Central Hub.",
          status: "Ready",
        },
        {
          title: "Temporary shelter",
          href: "/citizen/requests/request-shelter-003",
          description: "A place has been reserved at Unity Shelter.",
          status: "Matched",
        },
      ]}
      asideTitle="Need more help?"
      asideDescription="Submit a new request whenever your situation changes."
    />
  )
}
