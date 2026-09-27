import { Suspense } from "react"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { SecuritySection } from "@/features/settings/components/security-section"
import { SecuritySkeleton } from "@/features/settings/components/security-skeleton"

/**
 * Server-renderable security page. The section composition lives in a
 * `<Suspense>` boundary around `<SecuritySections />` with a pure
 * `<SecuritySkeleton />` fallback so the page is fully renderable on
 * the server.
 */
export default function SecuritySettingsPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Security"
          description="Manage how you sign in and prove it is you."
        />
        <Suspense fallback={<SecuritySkeleton />}>
          <SecuritySection />
        </Suspense>
      </Container>
    </Section>
  )
}
