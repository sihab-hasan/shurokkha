import AppResourceDetail from "@/components/app/app-resource-detail"

export default async function Page({
  params,
}: {
  params: Promise<{ contributionId: string }>
}) {
  const { contributionId } = await params
  return (
    <AppResourceDetail
      title="Contribution details"
      resourceLabel="Contribution"
      resourceId={contributionId}
      backHref="/donor/contributions"
    />
  )
}
