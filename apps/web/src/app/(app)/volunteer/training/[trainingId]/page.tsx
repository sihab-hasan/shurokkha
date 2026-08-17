import AppResourceDetail from "@/components/app/app-resource-detail"

export default async function Page({
  params,
}: {
  params: Promise<{ trainingId: string }>
}) {
  const { trainingId } = await params
  return (
    <AppResourceDetail
      title="Training module"
      resourceLabel="Training"
      resourceId={trainingId}
      backHref="/volunteer/training"
    />
  )
}
