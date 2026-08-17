import type { Metadata } from "next"

import { DEMO_USERNAME } from "@/config/username"
import DonorProfile from "@/components/app/profile/donor-profile"

export const metadata: Metadata = { title: "Donor Profile" }

export default function DonorProfilePage() {
  return <DonorProfile username={DEMO_USERNAME} />
}
