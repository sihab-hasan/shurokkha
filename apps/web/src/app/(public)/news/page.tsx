import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { NewsClarificationCard } from "@/features/news/components/news-clarification-card"
import { NewsSectionsGrid } from "@/features/news/components/news-sections-grid"

export const metadata: Metadata = {
  title: "News and updates",
  description:
    "Verified response, recovery, and platform news from the Shurokkha coordination team.",
}

/**
 * `/news` shell. Page-level composition: header → three lens grid
 * → clarification card.
 */
export default function NewsPage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="News and updates"
          title="Verified response, recovery, and platform updates"
          description="Shurokkha’s news pages route through three lenses: live response updates, community recovery stories, and platform-level announcements. Each one is tied to a primary source on the rest of the site."
        />

        <NewsSectionsGrid />
        <NewsClarificationCard />
      </Container>
    </Section>
  )
}
