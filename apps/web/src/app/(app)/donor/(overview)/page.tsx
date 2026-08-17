import type { Metadata } from "next"

import { DonorOverview } from "./_components/donor-overview"

export const metadata: Metadata = {
  title: "Donor Dashboard",
  description:
    "Follow donations, deliveries, campaigns, and their community impact.",
}

export default function DonorDashboardPage() {
  return <DonorOverview />
}
