import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ personId: string }>
}) {
  const { personId } = await params
  return (
    <AppResourceDetail
      title="Missing person report"
      resourceLabel="Report"
      resourceId={personId}
      backHref="/citizen/missing-persons"
    />
  )
}
