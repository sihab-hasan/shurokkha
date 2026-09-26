import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { MissingPersonDetail } from "@/features/missing-persons"

export default async function MissingPersonDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>
}) {
  const { reportId } = await params
  return (
    <Section className="space-y-6">
      <Container padded={false}>
        <MissingPersonDetail id={reportId} />
      </Container>
    </Section>
  )
}
