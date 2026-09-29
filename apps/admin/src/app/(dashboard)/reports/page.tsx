import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BarChart3, FileSearch } from "lucide-react"

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
import { ActiveTeamList } from "@/components/operations/active-team-list"
import { AreaSeverityChart } from "@/components/operations/area-severity-chart"
import { CitizenStatsPanel } from "@/components/operations/citizen-stats-panel"
import { ReportSummaryCards } from "@/components/operations/report-summary-card"
import { ShelterSummaryGrid } from "@/components/operations/shelter-summary-grid"
import { ReportSummaryLoader } from "./_components/report-summary-loader"

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Aggregated metrics, area-severity breakdowns, and live operational data.",
}

export default function ReportsPage() {
  return (
    <Section className="py-8 sm:py-10">
      <Container className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Aggregated metrics from the operations platform. Each card is driven
            by a live aggregate SQL view.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <FileSearch className="size-5" />
                </div>
                <CardTitle className="text-base">Join Reports</CardTitle>
              </div>
              <CardDescription>
                Inner / left / right / full outer joins and facility locations,
                sourced from raw SQL joins for cross-table inspection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href={adminRoutes.reports.joins} />}
              >
                <BarChart3 className="size-4" /> Open Join Reports
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
          <Card className="border-primary/20 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <BarChart3 className="size-5" />
                </div>
                <CardTitle className="text-base">TVUP</CardTitle>
              </div>
              <CardDescription>
                Tuple / View / Union / Procedure (TVUP) demonstrations —
                emergency history views, escalations, and transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href={adminRoutes.reports.tvup} />}
              >
                <BarChart3 className="size-4" /> Open TVUP Console
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <ReportSummaryLoader />

        <AreaSeverityChart />

        <div className="grid gap-6 lg:grid-cols-2">
          <ActiveTeamList />
          <CitizenStatsPanel />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">
            Shelter Summary
          </h2>
          <ShelterSummaryGrid />
        </div>
      </Container>
    </Section>
  )
}
