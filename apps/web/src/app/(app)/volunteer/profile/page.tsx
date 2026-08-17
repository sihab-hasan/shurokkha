import type { Metadata } from "next"

import { DEMO_USERNAME } from "@/config/username"
import VolunteerProfile from "@/components/app/profile/volunteer-profile"

export const metadata: Metadata = { title: "Volunteer Profile" }

export default function VolunteerProfilePage() {
  return <VolunteerProfile username={DEMO_USERNAME} />
}
