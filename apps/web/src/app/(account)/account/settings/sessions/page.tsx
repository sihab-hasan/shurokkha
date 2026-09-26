import { Suspense } from "react"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { SessionsSections } from "@/features/settings/components/sessions-sections"
import { SessionsSkeleton } from "@/features/settings/components/sessions-skeleton"

/**
 * Server-renderable sessions page. The session cards live in a
 * `<Suspense>` boundary around `<SessionsSections />` with a pure
 * `<SessionsSkeleton />` fallback so the page is fully renderable on
 * the server.
 */
export default function SessionsSettingsPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Sessions"
          description="The devices and browsers currently signed in to your account."
        />
        <Suspense fallback={<SessionsSkeleton />}>
          <SessionsSections />
        </Suspense>
      </Container>
    </Section>
  )
}
