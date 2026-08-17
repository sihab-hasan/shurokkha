import type { Metadata } from "next"

import { VolunteerOverview } from "./_components/volunteer-overview"

export const metadata: Metadata = {
  title: "Volunteer Dashboard",
  description:
    "Review assignments, response hours, assisted communities, and priority tasks.",
}

export default function VolunteerDashboardPage() {
  return <VolunteerOverview />
}
