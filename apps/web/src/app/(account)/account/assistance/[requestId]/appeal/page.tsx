import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

export default function AssistanceAppealPage({
  params,
}: {
  params: { requestId: string }
}) {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="max-w-2xl space-y-6">
        <PageHeader title={`Appeal Decision #${params.requestId}`} />

        <Card>
          <CardHeader>
            <CardTitle>Appeal Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Appeal</label>
              <textarea
                className="h-32 w-full rounded-md border bg-background p-2"
                placeholder="Explain why the claim should be re-evaluated..."
              />
            </div>
            <Button className="w-full">Submit Appeal</Button>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
