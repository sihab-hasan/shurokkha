import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  FileHeart,
  Home,
  PackageCheck,
  Plus,
} from "lucide-react"

import {
  DashboardGrid,
  MetricStrip,
  MetricStripItem,
  WidgetFrame,
} from "@shurokkha/ui-patterns/dashboard"
import { StatusBanner } from "@shurokkha/ui-patterns/feedback"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"
import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"

export function CitizenOverview() {
  const metrics = [
    {
      label: "Active requests",
      value: "2",
      note: "One update today",
      icon: FileHeart,
    },
    {
      label: "Nearby shelters",
      value: "12",
      note: "Two have capacity",
      icon: Home,
    },
    {
      label: "Resources matched",
      value: "8",
      note: "Three ready for pickup",
      icon: PackageCheck,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning"
        description="Here is the latest relief information for your area."
        actions={
          <Button
            nativeButton={false}
            size="lg"
            render={<Link href="/get-help" />}
          >
            <Plus data-icon="inline-start" /> Request assistance
          </Button>
        }
      />

      <MetricStrip columns={3}>
        {metrics.map(({ icon: Icon, label, note, value }) => (
          <MetricStripItem
            key={label}
            label={label}
            value={value}
            detail={note}
            icon={<Icon />}
          />
        ))}
      </MetricStrip>

      <DashboardGrid columns={2}>
        <WidgetFrame
          title="My relief requests"
          description="Track your most recent assistance requests."
        >
          <div className="divide-y divide-border">
            {[
              ["Medical assistance", "In progress", "Updated 18 min ago"],
              ["Emergency food pack", "Ready for pickup", "Central Hub"],
              ["Temporary shelter", "Matched", "Unity Shelter"],
            ].map(([title, status, detail]) => (
              <div
                key={title}
                className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
              >
                <FileHeart className="size-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{title}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
                <Badge variant="secondary">{status}</Badge>
              </div>
            ))}
          </div>
        </WidgetFrame>

        <div className="space-y-4">
          <StatusBanner
            tone="warning"
            icon={<AlertTriangle />}
            title="Heavy rainfall warning"
            description="Heavy rainfall is expected this evening. Keep essential documents ready and avoid low-lying roads."
            metadata="Riverside, Ward 4"
            action={
              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href="/emergency-alerts" />}
              >
                View alert <ArrowRight data-icon="inline-end" />
              </Button>
            }
          />
        </div>
      </DashboardGrid>
    </div>
  )
}
