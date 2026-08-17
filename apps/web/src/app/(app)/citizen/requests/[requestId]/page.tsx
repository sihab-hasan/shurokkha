import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ requestId: string }>
}) {
  const { requestId } = await params
  return (
    <AppResourceDetail
      title="Relief request"
      resourceLabel="Request"
      resourceId={requestId}
      backHref="/citizen/requests"
    />
  )
}
