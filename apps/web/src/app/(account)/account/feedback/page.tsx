import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { FeedbackClient } from "./_components/feedback-client"

export default function FeedbackPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Feedback"
          description="Tell us how the platform is working. We read every response."
        />
        <FeedbackClient />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Why we collect this</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Feedback shapes the next platform release. Anonymized data is shared
            with the coordination team monthly.
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
