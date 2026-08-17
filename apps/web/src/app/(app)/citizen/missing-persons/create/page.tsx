import type { Metadata } from "next"

import { MissingPersonForm } from "@/components/app/citizen/missing-persons/missing-person-form"

export const metadata: Metadata = { title: "Report Missing Person" }

export default function CreateMissingPersonPage() {
  return <MissingPersonForm />
}
