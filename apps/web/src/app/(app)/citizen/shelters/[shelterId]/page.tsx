import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ shelterId: string }>
}) {
  const { shelterId } = await params
  return (
    <AppResourceDetail
      title="Shelter information"
      resourceLabel="Shelter"
      resourceId={shelterId}
      backHref="/citizen/shelters"
    />
  )
}
