import type { Metadata } from "next"

import { MissingPersonList } from "@/components/app/citizen/missing-persons/missing-person-list"

export const metadata: Metadata = { title: "Missing Persons" }

export default function CitizenMissingPersonsPage() {
  return <MissingPersonList />
}
