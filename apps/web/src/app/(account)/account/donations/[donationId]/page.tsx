import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { DonationDetail } from "@/features/donations"

export default async function DonationDetailPage({
  params,
}: {
  params: Promise<{ donationId: string }>
}) {
  const { donationId } = await params
  return (
    <Section className="space-y-6">
      <Container padded={false}>
        <DonationDetail id={donationId} />
      </Container>
    </Section>
  )
}
