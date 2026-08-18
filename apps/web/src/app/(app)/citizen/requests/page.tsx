import type { Metadata } from "next"

import { AssistanceRequestList } from "@/components/app/citizen/assistance/assistance-request-list"

export const metadata: Metadata = { title: "My Requests" }

export default function CitizenRequestsPage() {
  return <AssistanceRequestList />
}
