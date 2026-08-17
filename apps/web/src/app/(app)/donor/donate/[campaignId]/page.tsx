import AppResourceDetail from "@/components/app/app-resource-detail"

export default async function Page({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  const { campaignId } = await params
  return (
    <AppResourceDetail
      title="Donate to campaign"
      resourceLabel="Campaign donation"
      resourceId={campaignId}
      backHref="/donor/donate"
    />
  )
}
