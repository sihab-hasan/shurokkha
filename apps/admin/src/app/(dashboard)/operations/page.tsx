import type { Metadata } from "next"
import Link from "next/link"
import {
  AlertTriangle,
  Building2,
  ClipboardList,
  FileText,
  HeartHandshake,
  MapPin,
  Newspaper,
  Package,
  Plus,
  ShieldCheck,
  Users,
  Warehouse,
} from "lucide-react"

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
    "Manage affected areas, rescue teams, relief logistics, and community response operations.",
}

export default function OperationsOverviewPage() {
  return (
    <Section className="py-6 sm:py-8">
      <Container className="space-y-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Response Operations
          </h1>
          <p className="text-sm text-muted-foreground">
            Central command console for real-time disaster management, rescue
            deployments, relief logistics, and public broadcasts.
          </p>
        </header>

        {/* ── Emergency Response ───────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-base font-semibold tracking-tight">
              Emergency Response Operations
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Affected Areas */}
            <Card className="flex flex-col justify-between border-primary/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <MapPin className="size-5" />
                  </div>
                  <CardTitle className="text-base">Affected Areas</CardTitle>
                </div>
                <CardDescription>
                  Geographic locations impacted by active emergencies.
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

            {/* Rescue Teams */}
            <Card className="flex flex-col justify-between border-primary/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <ShieldCheck className="size-5" />
                  </div>
                  <CardTitle className="text-base">Rescue Teams</CardTitle>
                </div>
                <CardDescription>
                  Registered emergency units, operational status, and rosters.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  nativeButton={false}
                  render={
                    <Link href={adminRoutes.operations.rescueTeams.list} />
                  }
                >
                  <Users className="size-4" /> View all
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={
                    <Link href={adminRoutes.operations.rescueTeams.new} />
                  }
                >
                  <Plus className="size-4" /> New
                </Button>
              </CardContent>
            </Card>

            {/* Team Management */}
            <Card className="flex flex-col justify-between border-primary/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <ClipboardList className="size-5" />
                  </div>
                  <CardTitle className="text-base">Team Assignments</CardTitle>
                </div>
                <CardDescription>
                  Active dispatch missions linking rescue units to requests.
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
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={
                    <Link href={adminRoutes.operations.teamManagement.new} />
                  }
                >
                  <Plus className="size-4" /> Dispatch
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Alerts */}
            <Card className="flex flex-col justify-between border-primary/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="size-5" />
                  </div>
                  <CardTitle className="text-base">Emergency Alerts</CardTitle>
                </div>
                <CardDescription>
                  Real-time broadcast bulletins, warning levels, and siren
                  feeds.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.alerts.list} />}
                >
                  <Users className="size-4" /> View all
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.alerts.new} />}
                >
                  <Plus className="size-4" /> Create
                </Button>
              </CardContent>
            </Card>

            {/* Evacuation Shelters */}
            <Card className="flex flex-col justify-between border-primary/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Building2 className="size-5" />
                  </div>
                  <CardTitle className="text-base">
                    Evacuation Shelters
                  </CardTitle>
                </div>
                <CardDescription>
                  Safe zones, live capacity trackers, and residency check-ins.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.shelters.list} />}
                >
                  <Users className="size-4" /> View all
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.shelters.new} />}
                >
                  <Plus className="size-4" /> Add
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Relief, Logistics & Content ─────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-base font-semibold tracking-tight">
              Logistics, Relief & Communications
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Volunteer Force */}
            <Card className="flex flex-col justify-between border-primary/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Users className="size-5" />
                  </div>
                  <CardTitle className="text-base">Volunteer Force</CardTitle>
                </div>
                <CardDescription>
                  Review applications, assign roles, and mobilize civil defense.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  nativeButton={false}
                  render={
                    <Link href={adminRoutes.operations.volunteers.list} />
                  }
                >
                  <Users className="size-4" /> View Volunteers
                </Button>
              </CardContent>
            </Card>

            {/* Aid Warehouses */}
            <Card className="flex flex-col justify-between border-primary/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Warehouse className="size-5" />
                  </div>
                  <CardTitle className="text-base">Aid Warehouses</CardTitle>
                </div>
                <CardDescription>
                  Depot inventory, relief supplies, and item distribution.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  nativeButton={false}
                  render={
                    <Link href={adminRoutes.operations.warehouses.list} />
                  }
                >
                  <Users className="size-4" /> View all
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.warehouses.new} />}
                >
                  <Plus className="size-4" /> New
                </Button>
              </CardContent>
            </Card>

            {/* Relief Donations */}
            <Card className="flex flex-col justify-between border-primary/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                    <Package className="size-5" />
                  </div>
                  <CardTitle className="text-base">Relief Donations</CardTitle>
                </div>
                <CardDescription>
                  Record direct contributions, receipt tracking, and ledger.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.donations.list} />}
                >
                  <Users className="size-4" /> View all
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.donations.new} />}
                >
                  <Plus className="size-4" /> Record
                </Button>
              </CardContent>
            </Card>

            {/* Fundraising Campaigns */}
            <Card className="flex flex-col justify-between border-primary/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
                    <HeartHandshake className="size-5" />
                  </div>
                  <CardTitle className="text-base">Fundraisers</CardTitle>
                </div>
                <CardDescription>
                  Public crowdfunding goals, raised milestones, and
                  beneficiaries.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  nativeButton={false}
                  render={
                    <Link href={adminRoutes.operations.fundraises.list} />
                  }
                >
                  <Users className="size-4" /> View all
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.fundraises.new} />}
                >
                  <Plus className="size-4" /> Launch
                </Button>
              </CardContent>
            </Card>

            {/* Preparedness Guides */}
            <Card className="flex flex-col justify-between border-primary/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <FileText className="size-5" />
                  </div>
                  <CardTitle className="text-base">Disaster Guides</CardTitle>
                </div>
                <CardDescription>
                  Safety instructions, emergency protocols, and offline guides.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.guides.list} />}
                >
                  <Users className="size-4" /> View all
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.guides.new} />}
                >
                  <Plus className="size-4" /> Draft
                </Button>
              </CardContent>
            </Card>

            {/* News & Updates */}
            <Card className="flex flex-col justify-between border-primary/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Newspaper className="size-5" />
                  </div>
                  <CardTitle className="text-base">News & Press</CardTitle>
                </div>
                <CardDescription>
                  Official press statements, situation bulletins, and media
                  releases.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.news.list} />}
                >
                  <Users className="size-4" /> View all
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={adminRoutes.operations.news.new} />}
                >
                  <Plus className="size-4" /> Publish
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </Container>
    </Section>
  )
}
