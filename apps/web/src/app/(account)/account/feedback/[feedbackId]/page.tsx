import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { FeedbackDetailClient } from "@/features/account-lifecycle/components/feedback-detail-client"

export default async function FeedbackDetailPage({
  params,
}: {
  params: Promise<{ feedbackId: string }>
}) {
  const { feedbackId } = await params
  return (
    <Section className="space-y-6">
      <Container padded={false}>
        <FeedbackDetailClient id={feedbackId} />
      </Container>
    </Section>
  )
}
