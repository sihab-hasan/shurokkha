import AppResourceDetail from "@/components/app/app-resource-detail"

export default async function Page({
  params,
}: {
  params: Promise<{ shiftId: string }>
}) {
  const { shiftId } = await params
  return (
    <AppResourceDetail
      title="Scheduled shift"
      resourceLabel="Shift"
      resourceId={shiftId}
      backHref="/volunteer/schedule"
    />
  )
}
