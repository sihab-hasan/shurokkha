import type { Metadata } from "next"

import { FundraiseArticle } from "@/features/fundraise/components/fundraise-article"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Fundraise · ${slug}`,
    description: "Read the full campaign on Shurokkha.",
  }
}

export default async function FundraiseArticlePage({ params }: PageProps) {
  const { slug } = await params
  return <FundraiseArticle slug={slug} />
}
