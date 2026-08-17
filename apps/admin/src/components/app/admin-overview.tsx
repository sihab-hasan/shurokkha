import Link from "next/link"
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  HeartHandshake,
  LifeBuoy,
  MapPinned,
  RadioTower,
  Siren,
  UsersRound,
} from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Badge } from "@shurokkha/ui/components/badge"
import { Separator } from "@shurokkha/ui/components/separator"
import {
  DashboardGrid,
  KpiCard,
  MetricStrip,
  MetricStripItem,
  WidgetFrame,
} from "@shurokkha/ui-patterns/dashboard"
import { StatusBanner } from "@shurokkha/ui-patterns/feedback"
import { ContentSection } from "@shurokkha/ui-patterns/layout"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"
import { ProcessSteps } from "@shurokkha/ui-patterns/progress"

const queues = [
  {
    label: "Help requests awaiting triage",
    count: 18,
    tone: "destructive" as const,
  },
  { label: "Shelter capacity updates", count: 7, tone: "secondary" as const },
  { label: "Volunteer assignments", count: 23, tone: "outline" as const },
  { label: "Donation verification", count: 9, tone: "secondary" as const },
]

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="National operations"
        title="Command center"
        description="Monitor active incidents, operational capacity, pending approvals, and cross-team response from one shared control surface."
        metadata={
          <>
            <span className="inline-flex items-center gap-1.5">
              <RadioTower className="size-3.5" /> Live data feed
            </span>
            <span>Last synchronized 2 minutes ago</span>
          </>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/reports" />}
            >
              View reports
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/incidents/new" />}
            >
              <Siren /> Create incident
            </Button>
          </div>
        }
      />

      <StatusBanner
        tone="warning"
        icon={<CircleAlert />}
        title="Three districts are reporting shelter utilization above 85%."
        description="Review capacity, nearby overflow locations, and transport readiness before the next coordination window."
        metadata="Operational advisory • updated 6 minutes ago"
        action={
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            render={<Link href="/shelters" />}
          >
            Review capacity
          </Button>
        }
      />

      <MetricStrip columns={4}>
        <MetricStripItem
          icon={<Siren />}
          value="12"
          label="Active incidents"
          detail="4 high priority"
        />
        <MetricStripItem
          icon={<LifeBuoy />}
          value="86"
          label="Open shelters"
          detail="11,420 spaces available"
        />
        <MetricStripItem
          icon={<HeartHandshake />}
          value="1,284"
          label="Ready volunteers"
          detail="312 currently deployed"
        />
        <MetricStripItem
          icon={<UsersRound />}
          value="2,941"
          label="People assisted"
          detail="Today across all regions"
        />
      </MetricStrip>

      <DashboardGrid columns={4}>
        <KpiCard
          label="Response SLA"
          value="92%"
          supportingText="Requests acknowledged within target"
          trend={{ value: "+4.8%", direction: "up" }}
          icon={<Clock3 />}
        />
        <KpiCard
          label="Verified requests"
          value="418"
          supportingText="Validated in the last 24 hours"
          trend={{ value: "+36", direction: "up" }}
          icon={<CheckCircle2 />}
        />
        <KpiCard
          label="Pending approvals"
          value="27"
          supportingText="Across logistics and finance"
          trend={{ value: "9 urgent", direction: "neutral" }}
          icon={<ClipboardCheck />}
        />
        <KpiCard
          label="Critical alerts"
          value="6"
          supportingText="Require ongoing operator review"
          trend={{ value: "2 new", direction: "down" }}
          icon={<BellRing />}
        />
      </DashboardGrid>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,.6fr)]">
        <WidgetFrame
          title="Operational queues"
          description="Work that needs attention before the next coordination cycle."
          actions={
            <Button
              size="sm"
              variant="ghost"
              nativeButton={false}
              render={<Link href="/approvals" />}
            >
              Open queue <ArrowRight />
            </Button>
          }
        >
          <div className="space-y-1">
            {queues.map((item, index) => (
              <div key={item.label}>
                <div className="flex items-center gap-3 py-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-sm font-semibold tabular-nums">
                    {item.count}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium">
                    {item.label}
                  </span>
                  <Badge variant={item.tone}>Review</Badge>
                </div>
                {index < queues.length - 1 ? <Separator /> : null}
              </div>
            ))}
          </div>
        </WidgetFrame>

        <WidgetFrame
          title="Incident response"
          description="Standard operational progression for newly validated incidents."
        >
          <ProcessSteps
            steps={[
              {
                id: "validate",
                title: "Validate signal",
                description: "Confirm source and affected area.",
                status: "complete",
              },
              {
                id: "activate",
                title: "Activate response",
                description: "Assign lead teams and open resources.",
                status: "current",
              },
              {
                id: "coordinate",
                title: "Coordinate field work",
                description: "Track shelters, teams and requests.",
              },
              {
                id: "close",
                title: "Close & report",
                description: "Archive outcomes and publish review.",
              },
            ]}
          />
        </WidgetFrame>
      </div>

      <ContentSection
        title="Operational shortcuts"
        description="Shared entry points use the same patterns across the web and admin applications."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Operations map",
              description: "Explore incidents, shelters and field coverage.",
              icon: MapPinned,
              href: "/operations",
            },
            {
              title: "Shelter network",
              description: "Capacity, readiness and verification status.",
              icon: LifeBuoy,
              href: "/shelters",
            },
            {
              title: "People & access",
              description: "Roles, identity and permissions review.",
              icon: UsersRound,
              href: "/people",
            },
            {
              title: "Approvals",
              description: "Review high-impact operational changes.",
              icon: ClipboardCheck,
              href: "/approvals",
            },
          ].map((item) => (
            <Button
              key={item.title}
              variant="outline"
              nativeButton={false}
              render={<Link href={item.href} />}
              className="h-auto justify-start gap-3 rounded-xl p-4 text-left"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{item.title}</span>
                <span className="mt-1 block text-xs leading-relaxed font-normal whitespace-normal text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </ContentSection>
    </div>
  )
}
