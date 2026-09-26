import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

export default function FeedbackDetailPage({
  params,
}: {
  params: { feedbackId: string }
}) {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader title={`Feedback #${params.feedbackId}`} />

        <Card>
          <CardHeader>
            <CardTitle>Thread History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Feedback ID: {params.feedbackId}
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
