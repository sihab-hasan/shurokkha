import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { AssistanceRequestDetail } from "@/features/assistance"

export default async function AssistanceDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>
}) {
  const { requestId } = await params
  return (
    <Section className="space-y-6">
      <Container padded={false}>
        <AssistanceRequestDetail id={requestId} />
      </Container>
    </Section>
  )
}
