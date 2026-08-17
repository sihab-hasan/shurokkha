import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ missionId: string }>
}) {
  const { missionId } = await params
  return (
    <AppResourceDetail
      title="Rescue mission"
      resourceLabel="Mission"
      resourceId={missionId}
      backHref="/volunteer/missions"
    />
  )
}
