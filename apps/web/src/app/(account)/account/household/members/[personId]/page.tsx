import Link from "next/link"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

export default function HouseholdMemberDetailPage({
  params,
}: {
  params: { personId: string }
}) {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="max-w-2xl space-y-6">
        <PageHeader
          title={`Household Member #${params.personId}`}
          description="Edit this member from the household roster."
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/account/household" />}
        >
          Back to household roster
        </Button>
      </Container>
    </Section>
  )
}
