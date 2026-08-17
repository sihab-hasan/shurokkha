import { DocsReferencePage } from "@/components/docs/docs-reference-page"

export default async function DocsReferenceRoute({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  return <DocsReferencePage slug={slug} />
}
