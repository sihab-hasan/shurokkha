import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ distributionId: string }>
}) {
  const { distributionId } = await params
  return (
    <AppResourceDetail
      title="Resource distribution"
      resourceLabel="Distribution"
      resourceId={distributionId}
      backHref="/volunteer/distributions"
    />
  )
}
