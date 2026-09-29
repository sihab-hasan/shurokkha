import Link from "next/link"

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

export default function MissionDetailPage({
  params,
}: {
  params: { missionId: string }
}) {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="max-w-2xl space-y-6">
        <PageHeader title={`Mission Brief #${params.missionId}`} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mission detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Mission briefs are issued by the coordination team once your
              volunteer application is approved and you are assigned to a
              disaster response.
            </p>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/account/volunteering" />}
            >
              Back to volunteering
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
