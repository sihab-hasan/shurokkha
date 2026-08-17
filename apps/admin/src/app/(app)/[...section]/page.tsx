import { AdminSectionPage } from "@/components/app/admin-section-page"

export default async function AdminSectionRoute({
  params,
}: {
  params: Promise<{ section: string[] }>
}) {
  const { section } = await params
  return <AdminSectionPage section={section} />
}
