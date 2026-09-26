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
      <Container padded={false} className="space-y-6">
        <PageHeader title={`Mission Brief #${params.missionId}`} />

        <Card>
          <CardHeader>
            <CardTitle>Mission Assignment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Mission ID</span>
              <span className="font-semibold">{params.missionId}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Lead Coordinator</span>
              <span>Rahim Ahmed (+880 1711-XXXXXX)</span>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
