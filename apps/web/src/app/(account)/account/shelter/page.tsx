import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { ShelterResidencyClient } from "./_components/shelter-residency-client"

export default function ShelterPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Shelter Allocation & Camp Info"
          description="Check into or out of a shelter assigned by the coordination team."
        />
        <ShelterResidencyClient />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What to expect</CardTitle>
            <CardDescription>
              Your residency record follows the official shelter assignment made
              by the coordination team. Check out when you leave so the next
              household can be assigned.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Shelter capacities are updated continuously. If your assigned
              shelter is full or inaccessible, file a help request and we will
              re-route you.
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
