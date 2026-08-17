import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ trackingId: string }>
}) {
  const { trackingId } = await params
  return (
    <AppResourceDetail
      title="Contribution tracking"
      resourceLabel="Tracking"
      resourceId={trackingId}
      backHref="/donor/tracking"
    />
  )
}
