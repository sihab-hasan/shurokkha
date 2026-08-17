import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ alertId: string }>
}) {
  const { alertId } = await params
  return (
    <AppResourceDetail
      title="Emergency alert"
      resourceLabel="Alert"
      resourceId={alertId}
      backHref="/donor/alerts"
    />
  )
}
