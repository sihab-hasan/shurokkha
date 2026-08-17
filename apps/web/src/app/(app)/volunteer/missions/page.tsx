import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Assigned Rescue Missions" }
export default function VolunteerMissionsPage() {
  return (
    <AppCollectionPage
      title="Rescue missions"
      description="View only the rescue operations assigned to you or your team."
      items={[
        {
          title: "Riverside evacuation support",
          href: "/volunteer/missions/mission-evacuation-001",
          description: "Ward 4 · Team Alpha · Check-in at 10:15 AM",
          status: "Assigned",
        },
        {
          title: "Medical transport assistance",
          href: "/volunteer/missions/mission-medical-002",
          description: "Unity Shelter → Riverside Clinic · 2:30 PM",
          status: "Scheduled",
        },
        {
          title: "North Road welfare check",
          href: "/volunteer/missions/mission-welfare-003",
          description: "Team Bravo · Awaiting field clearance",
          status: "Standby",
        },
      ]}
      asideTitle="Mission safety"
      asideDescription="Do not begin rescue activity until your team lead confirms the assignment."
    />
  )
}
