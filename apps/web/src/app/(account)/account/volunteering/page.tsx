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

import { routes } from "@/config/routes"

export default function VolunteeringPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Volunteering & Rescue Missions"
          actions={
            <Button
              nativeButton={false}
              render={<Link href={routes.account.volunteeringApplication} />}
            >
              Apply as Volunteer
            </Button>
          }
        />

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sylhet Sadar Relief Distribution Crew</CardTitle>
                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Assigned
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Shift: 08:00 AM - 04:00 PM • Base: Camp 4 Logistics Depot
              </p>
              <Button
                size="sm"
                variant="outline"
                render={
                  <Link href={routes.account.volunteeringMission("MSN-7712")} />
                }
              >
                Mission Brief
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
