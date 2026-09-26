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

export default function VolunteerApplicationPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="max-w-2xl space-y-6">
        <PageHeader title="Volunteer Onboarding Application" />

        <Card>
          <CardHeader>
            <CardTitle>Skills & Verification Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Skill Set</label>
              <select className="w-full rounded-md border bg-background p-2">
                <option>First Aid & Medical Assistance</option>
                <option>Boat Operations & Water Rescue</option>
                <option>Logistics & Food Distribution</option>
                <option>Crisis Counseling & Social Work</option>
              </select>
            </div>
            <Button className="w-full">Submit Application</Button>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
