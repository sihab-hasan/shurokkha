import { Suspense } from "react"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { NotificationsSections } from "@/features/settings/components/notifications-sections"
import { NotificationsSkeleton } from "@/features/settings/components/notifications-skeleton"

/**
 * Server-renderable notifications page. The data-driven form lives in a
 * `<Suspense>` boundary around `<NotificationsSections />` with a pure
 * `<NotificationsSkeleton />` fallback so the page is fully renderable
 * on the server.
 */
export default function NotificationsSettingsPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Notifications"
          description="Choose how and when Shurokkha reaches you."
        />
        <Suspense fallback={<NotificationsSkeleton />}>
          <NotificationsSections />
        </Suspense>
      </Container>
    </Section>
  )
}
