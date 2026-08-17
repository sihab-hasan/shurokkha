import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ disasterId: string }>
}) {
  const { disasterId } = await params
  return (
    <AppResourceDetail
      title="Disaster update"
      resourceLabel="Disaster"
      resourceId={disasterId}
      backHref="/citizen/disasters"
    />
  )
}
