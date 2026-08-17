import type { Metadata } from "next"

import { CitizenOverview } from "./_components/citizen-overview"

export const metadata: Metadata = {
  title: "Citizen Dashboard",
  description:
    "Track relief requests, nearby shelters, resources, and emergency alerts.",
}

export default function CitizenDashboardPage() {
  return <CitizenOverview />
}
