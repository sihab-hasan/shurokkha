import type { Metadata } from "next"

import { AssistanceRequestDetail } from "@/components/app/citizen/assistance/assistance-request-detail"

export const metadata: Metadata = { title: "Assistance Request" }

export default async function CitizenRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>
}) {
  const { requestId } = await params
  return <AssistanceRequestDetail id={requestId} />
}
