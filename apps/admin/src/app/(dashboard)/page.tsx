import type { Metadata } from "next"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardList,
  Database,
  FileSearch,
  FileText,
  HeartHandshake,
  Layers,
  MapPin,
  Newspaper,
  Package,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
  UsersRound,
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
  title: "Admin Command Center",
  description:
    "Internal operations workspace and command center for Shurokkha disaster response.",
}

export default function DashboardHomePage() {
  return (
    <Section className="py-6 sm:py-8">
      <Container className="space-y-10">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground shadow-xs">
                SA
              </span>
              <h1 className="text-2xl font-bold tracking-tight">
                Command Console
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Internal disaster management, emergency dispatch, logistics, and
              system governance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href={adminRoutes.operations.root} />}
            >
              <Layers className="size-4" /> Operations Hub
            </Button>
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href={adminRoutes.reports.list} />}
            >
              <TrendingUp className="size-4" /> Live Reports
            </Button>
          </div>
        </header>

        {/* ── Quick Domain Jump Cards ───────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/20 shadow-xs transition-colors hover:border-primary/40">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Response Operations
                </CardTitle>
                <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                  <Layers className="size-4" />
                </div>
              </div>
              <CardDescription className="text-xs">
                11 active modules
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link
                href={adminRoutes.operations.root}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Open console <ArrowRight className="size-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-xs transition-colors hover:border-primary/40">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Emergency Alerts
                </CardTitle>
                <div className="rounded-md bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="size-4" />
                </div>
              </div>
              <CardDescription className="text-xs">
                Broadcast warning sirens
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link
                href={adminRoutes.operations.alerts.list}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Manage alerts <ArrowRight className="size-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-xs transition-colors hover:border-primary/40">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Analytics & Reports
                </CardTitle>
                <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                  <BarChart3 className="size-4" />
                </div>
              </div>
              <CardDescription className="text-xs">
                SQL views, joins & TVUP
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link
                href={adminRoutes.reports.list}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View reports <ArrowRight className="size-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-xs transition-colors hover:border-primary/40">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  User Governance
                </CardTitle>
                <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                  <UsersRound className="size-4" />
                </div>
              </div>
              <CardDescription className="text-xs">
                Accounts & security logs
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link
                href={adminRoutes.users.list}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Manage users <ArrowRight className="size-3" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* ── Section 1: Emergency Operations ───────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Emergency & Response Dispatch
              </h2>
              <p className="text-xs text-muted-foreground">
                Rapid response coordination, rescue unit allocation, and shelter
                logistics.
              </p>
            </div>
            <Link
              href={adminRoutes.operations.root}
              className="text-xs font-medium text-primary hover:underline"
            >
              All Operations →
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href={adminRoutes.operations.affectedAreas.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Affected Areas</div>
                  <div className="text-xs text-muted-foreground">
                    Impact severity & population maps
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.operations.rescueTeams.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Rescue Teams</div>
                  <div className="text-xs text-muted-foreground">
                    Available units, equipment & status
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.operations.teamManagement.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ClipboardList className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Team Assignments</div>
                  <div className="text-xs text-muted-foreground">
                    Active mission dispatches & routes
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.operations.alerts.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-amber-500/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-amber-500/10 p-2 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white dark:text-amber-400">
                  <AlertTriangle className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Emergency Alerts</div>
                  <div className="text-xs text-muted-foreground">
                    Broadcast public warning levels
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.operations.shelters.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Evacuation Shelters</div>
                  <div className="text-xs text-muted-foreground">
                    Occupancy & resident rosters
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </div>
        </section>

        {/* ── Section 2: Relief, Logistics & Content ────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Relief Logistics, Civil Defense & Publishing
              </h2>
              <p className="text-xs text-muted-foreground">
                Warehousing inventory, financial donations, volunteers, and
                safety content.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href={adminRoutes.operations.volunteers.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Users className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Volunteer Force</div>
                  <div className="text-xs text-muted-foreground">
                    Application approvals & roles
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.operations.warehouses.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Warehouse className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Aid Warehouses</div>
                  <div className="text-xs text-muted-foreground">
                    Relief stock & distribution log
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.operations.donations.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-emerald-500/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:text-emerald-400">
                  <Package className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Relief Donations</div>
                  <div className="text-xs text-muted-foreground">
                    Financial receipts & records
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.operations.fundraises.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-rose-500/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-rose-500/10 p-2 text-rose-600 transition-colors group-hover:bg-rose-600 group-hover:text-white dark:text-rose-400">
                  <HeartHandshake className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Fundraisers</div>
                  <div className="text-xs text-muted-foreground">
                    Target goals & public campaigns
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.operations.guides.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <FileText className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Disaster Guides</div>
                  <div className="text-xs text-muted-foreground">
                    Protocols & survival guides
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.operations.news.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Newspaper className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">News & Press</div>
                  <div className="text-xs text-muted-foreground">
                    Press bulletins & releases
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </div>
        </section>

        {/* ── Section 3: Intelligence & Administration ──────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Intelligence, SQL Analytics & Governance
              </h2>
              <p className="text-xs text-muted-foreground">
                Aggregated reporting views, cross-table SQL join inspections,
                and user access audits.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href={adminRoutes.reports.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <BarChart3 className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Live Reports</div>
                  <div className="text-xs text-muted-foreground">
                    Aggregated SQL views
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.reports.joins}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <FileSearch className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">SQL Join Reports</div>
                  <div className="text-xs text-muted-foreground">
                    Cross-table joins
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.reports.tvup}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Database className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">TVUP Console</div>
                  <div className="text-xs text-muted-foreground">
                    View, Union, Proc, Trans
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.users.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <UsersRound className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">User Accounts</div>
                  <div className="text-xs text-muted-foreground">
                    RBAC roles & access
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>

            <Link
              href={adminRoutes.loginAudits.list}
              className="group flex items-center justify-between rounded-lg border bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ShieldAlert className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Security Audits</div>
                  <div className="text-xs text-muted-foreground">
                    IP & session log history
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </div>
        </section>
      </Container>
    </Section>
  )
}
