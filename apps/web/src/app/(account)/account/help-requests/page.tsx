import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { HelpRequestsClient } from "./_components/help-requests-client"

export default function HelpRequestsPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Support & Help Desk"
          description="Submit a non-emergency help request. The coordination team will assign a rescue team or refer you to a service."
        />
        <HelpRequestsClient />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">When to use this</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Use this for non-urgent help — supplies, transport coordination,
              shelter referral, or medical information.
            </p>
            <p>
              For life-threatening emergencies, use the emergency hotline — help
              requests are not monitored in real time.
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
