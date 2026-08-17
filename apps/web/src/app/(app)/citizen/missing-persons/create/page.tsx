import AppResourceDetail from "@/components/app/app-resource-detail"

export default function Page() {
  return (
    <AppResourceDetail
      title="Create missing person report"
      resourceLabel="New report"
      resourceId="Generated after submission"
      backHref="/citizen/missing-persons"
    />
  )
}
