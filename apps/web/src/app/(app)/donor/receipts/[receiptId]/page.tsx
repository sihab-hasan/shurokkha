import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ receiptId: string }>
}) {
  const { receiptId } = await params
  return (
    <AppResourceDetail
      title="Donation receipt"
      resourceLabel="Receipt"
      resourceId={receiptId}
      backHref="/donor/receipts"
    />
  )
}
