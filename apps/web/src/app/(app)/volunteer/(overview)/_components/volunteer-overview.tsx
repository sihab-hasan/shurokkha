import Link from "next/link"
import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  MapPin,
  Plus,
  UsersRound,
} from "lucide-react"

import {
  DashboardGrid,
  MetricStrip,
  MetricStripItem,
  WidgetFrame,
} from "@shurokkha/ui-patterns/dashboard"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"
import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"

import { routes } from "@/config/routes"

export function VolunteerOverview() {
  const metrics = [
    { value: "3", label: "Active assignments", icon: ClipboardCheck },
    { value: "42", label: "Hours contributed", icon: Clock3 },
    { value: "118", label: "People assisted", icon: UsersRound },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ready for your next shift?"
        description="Review assignments, team updates, and upcoming response work."
        actions={
          <Button
            nativeButton={false}
            size="lg"
            render={<Link href={routes.volunteer.assignments} />}
          >
            <Plus data-icon="inline-start" /> Find an assignment
          </Button>
        }
      />

      <MetricStrip columns={3}>
        {metrics.map(({ value, label, icon: Icon }) => (
          <MetricStripItem
            key={label}
            value={value}
            label={label}
            icon={<Icon />}
          />
        ))}
      </MetricStrip>

      <DashboardGrid columns={2}>
        <WidgetFrame
          title="Today's assignments"
          description="Your response plan for 24 May."
        >
          <div className="divide-y divide-border">
            {[
              [
                "Community response briefing",
                "9:00 AM",
                "Central Hub",
                "Confirmed",
              ],
              [
                "Deliver water supplies",
                "11:30 AM",
                "Riverside, Ward 4",
                "Next",
              ],
              ["Relief-kit preparation", "3:00 PM", "Central Hub", "Scheduled"],
            ].map(([title, time, location, status]) => (
              <div
                key={title}
                className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarClock className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{title}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {location} · {time}
                  </p>
                </div>
                <Badge variant="secondary">{status}</Badge>
              </div>
            ))}
          </div>
        </WidgetFrame>

        <WidgetFrame
          title="Shift readiness"
          description="Complete these before departure."
        >
          <div className="space-y-4">
            {[
              "Safety briefing reviewed",
              "Team lead confirmed",
              "Equipment collected",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-primary" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
            <Button
              nativeButton={false}
              className="mt-2"
              variant="outline"
              render={<Link href={routes.volunteer.assignments} />}
            >
              Open checklist
            </Button>
          </div>
        </WidgetFrame>
      </DashboardGrid>
    </div>
  )
}
