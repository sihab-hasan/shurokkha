import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { NotificationsClient } from "./_components/notifications-client"

export default function NotificationsPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Notifications & Disaster Alerts"
          description="The latest active alerts from the coordination team."
        />
        <NotificationsClient />
      </Container>
    </Section>
  )
}
