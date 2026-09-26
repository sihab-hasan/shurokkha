export default async function AdminSectionRoute({
  params,
}: {
  params: Promise<{ section: string[] }>
}) {
  await params
  return null
}
