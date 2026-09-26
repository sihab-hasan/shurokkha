import { Suspense } from "react"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { PrivacySections } from "@/features/settings/components/privacy-sections"
import { PrivacySkeleton } from "@/features/settings/components/privacy-skeleton"

/**
 * Server-renderable privacy page. The data-driven form lives in a
 * `<Suspense>` boundary around `<PrivacySections />` with a pure
 * `<PrivacySkeleton />` fallback so the page is fully renderable on
 * the server.
 */
export default function PrivacySettingsPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Privacy"
          description="Control what is shared, with whom, and how you appear."
        />
        <Suspense fallback={<PrivacySkeleton />}>
          <PrivacySections />
        </Suspense>
      </Container>
    </Section>
  )
}
