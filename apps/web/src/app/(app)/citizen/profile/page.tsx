import type { Metadata } from "next"

import { DEMO_USERNAME } from "@/config/username"
import CitizenProfile from "@/components/app/profile/citizen-profile"

export const metadata: Metadata = { title: "Citizen Profile" }

export default function CitizenProfilePage() {
  return <CitizenProfile username={DEMO_USERNAME} />
}
