import type { Metadata } from "next"

import { MissingPersonDetail } from "@/components/app/citizen/missing-persons/missing-person-detail"

export const metadata: Metadata = { title: "Missing Person Report" }

export default async function MissingPersonDetailPage({
  params,
}: {
  params: Promise<{ personId: string }>
}) {
  const { personId } = await params
  return <MissingPersonDetail id={personId} />
}
