import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Volunteer Assignments" }
export default function VolunteerAssignmentsPage() {
  return (
    <AppCollectionPage
      title="Assignments"
      description="Review active field work and available response tasks."
      items={[
        {
          title: "Deliver water supplies",
          href: "/volunteer/assignments/assignment-water-001",
          description: "Riverside, Ward 4 · Today at 11:30 AM",
          status: "Next",
        },
        {
          title: "Relief-kit preparation",
          href: "/volunteer/assignments/assignment-kit-002",
          description: "Central Hub · Today at 3:00 PM",
          status: "Confirmed",
        },
        {
          title: "Shelter intake support",
          href: "/volunteer/assignments/assignment-shelter-003",
          description: "Unity Shelter · Tomorrow at 8:00 AM",
          status: "Scheduled",
        },
      ]}
      asideTitle="Field readiness"
      asideDescription="Check in with your team lead before starting every assignment."
    />
  )
}
