import type { Metadata } from "next"

import { AssistanceRequestForm } from "@/components/app/citizen/assistance/assistance-request-form"

export const metadata: Metadata = { title: "Request Emergency Help" }

export default function RequestHelpPage() {
  return <AssistanceRequestForm />
}
