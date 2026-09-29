import type { Metadata } from "next"

import { NewsArticle } from "@/features/news/components/news-article"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `News · ${slug}`,
    description: "Read the full story on Shurokkha.",
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params
  return <NewsArticle slug={slug} />
}
