import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
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
      <Container padded={false} className="space-y-6">
        <PageHeader title={`Household Member #${params.personId}`} />

        <Card>
          <CardHeader>
            <CardTitle>Member Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Member ID: {params.personId}
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
