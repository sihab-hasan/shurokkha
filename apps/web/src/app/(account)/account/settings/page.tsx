import { Suspense } from "react"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import {
  SettingsOverviewList,
  SettingsOverviewSkeleton,
} from "@/features/settings/components/settings-overview-list"

/**
 * Server-renderable settings overview page.
 *
 * Mirrors the management-page pattern used by `/account/assistance`,
 * `/account/missing-persons`, `/account/donations`, and `/account/profile`:
 *  - `<Section>` provides top-of-page breathing room from the shell header
 *  - `<Container padded={false}>` controls horizontal alignment + rhythm
 *  - `<PageHeader>` ships in the initial HTML so the title is indexable
 *  - the data-driven list lives in a `<Suspense>` boundary around the
 *    `<SettingsOverviewList />` client island, with a pure-markup
 *    `<SettingsOverviewSkeleton />` fallback so the page is fully
 *    renderable on the server.
 */
export default function SettingsOverviewPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Settings"
          description="Quick links to every category of account settings."
        />
        <Suspense fallback={<SettingsOverviewSkeleton />}>
          <SettingsOverviewList />
        </Suspense>
      </Container>
    </Section>
  )
}
