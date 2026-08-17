import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ donationId: string }>
}) {
  const { donationId } = await params
  return (
    <AppResourceDetail
      title="Donation details"
      resourceLabel="Donation"
      resourceId={donationId}
      backHref="/donor/donations"
    />
  )
}
