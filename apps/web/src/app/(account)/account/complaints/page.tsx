import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { ComplaintsClient } from "./_components/complaints-client"

export default function ComplaintsPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Misconduct & Grievances"
          description="Submit a complaint about services, staff, or logistics. Reviewed by the coordination team."
        />
        <ComplaintsClient />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How complaints work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Every complaint goes to a coordination team member who responds
              within the published SLA. You&apos;ll see status updates and a
              resolution note once the team reviews your case.
            </p>
            <p>
              For life-threatening issues, please use the emergency hotline —
              the complaint system is not monitored in real time.
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
