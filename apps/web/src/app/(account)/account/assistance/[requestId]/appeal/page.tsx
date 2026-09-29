import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { AssistanceAppealClient } from "./_components/assistance-appeal-client"

export default async function AssistanceAppealPage({
  params,
}: {
  params: Promise<{ requestId: string }>
}) {
  const { requestId } = await params
  return (
    <Section className="space-y-6">
      <Container padded={false} className="max-w-2xl space-y-6">
        <PageHeader
          title="Appeal Decision"
          description="Submit a reason to have this request reviewed again by the coordination team."
        />
        <AssistanceAppealClient requestId={requestId} />
      </Container>
    </Section>
  )
}
