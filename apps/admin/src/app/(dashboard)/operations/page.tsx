import type { Metadata } from "next"
import Link from "next/link"
import { ClipboardList, MapPin, Plus, ShieldCheck, Users } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"

export const metadata: Metadata = {
  title: "Response Operations",
  description:
    "Manage affected areas, rescue teams, and team assignments from one console.",
}

export default function OperationsOverviewPage() {
  return (
    <Section className="py-8 sm:py-10">
      <Container className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Response Operations
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the live state of affected areas, registered rescue teams,
            and active assignments.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <MapPin className="size-5" />
                </div>
                <CardTitle className="text-base">Affected Areas</CardTitle>
              </div>
              <CardDescription>
                Geographic areas impacted by an active disaster.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                nativeButton={false}
                render={
                  <Link href={adminRoutes.operations.affectedAreas.list} />
                }
              >
                <Users className="size-4" /> View all
              </Button>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={
                  <Link href={adminRoutes.operations.affectedAreas.new} />
                }
              >
                <Plus className="size-4" /> New
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <CardTitle className="text-base">Rescue Teams</CardTitle>
              </div>
              <CardDescription>
                Registered response units and their availability.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                nativeButton={false}
                render={<Link href={adminRoutes.operations.rescueTeams.list} />}
              >
                <Users className="size-4" /> View all
              </Button>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href={adminRoutes.operations.rescueTeams.new} />}
              >
                <Plus className="size-4" /> New
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <ClipboardList className="size-5" />
                </div>
                <CardTitle className="text-base">Team Management</CardTitle>
              </div>
              <CardDescription>
                Active assignments linking teams to emergency requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                nativeButton={false}
                render={
                  <Link href={adminRoutes.operations.teamManagement.list} />
                }
              >
                <Users className="size-4" /> View all
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
