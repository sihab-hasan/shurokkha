import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  const { campaignId } = await params
  return (
    <AppResourceDetail
      title="Relief campaign"
      resourceLabel="Campaign"
      resourceId={campaignId}
      backHref="/donor/campaigns"
    />
  )
}
