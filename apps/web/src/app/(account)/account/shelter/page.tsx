import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

export default function ShelterPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader title="Shelter Allocation & Camp Info" />
        <Card>
          <CardHeader>
            <CardTitle>Assigned Shelter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold">
              Sylhet Model Government High School Camp
            </p>
            <p className="text-xs text-muted-foreground">
              Hall B, Bed #34 • Capacity: 450 people
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
