import type { Metadata } from "next"

import { DonorImpactReport } from "./_components/donor-impact-report"

export const metadata: Metadata = { title: "Impact Report" }

export default function DonorImpactPage() {
  return <DonorImpactReport />
}
