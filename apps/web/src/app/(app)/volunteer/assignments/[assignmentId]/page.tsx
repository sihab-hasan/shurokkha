import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ assignmentId: string }>
}) {
  const { assignmentId } = await params
  return (
    <AppResourceDetail
      title="Volunteer assignment"
      resourceLabel="Assignment"
      resourceId={assignmentId}
      backHref="/volunteer/assignments"
    />
  )
}
