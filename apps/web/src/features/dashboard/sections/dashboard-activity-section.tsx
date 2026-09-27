import * as React from "react"
import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Button } from "@shurokkha/ui/components/button"
import { routes } from "@/config/routes"

import { RecentDonationActivityItem } from "./recent-donation-activity-item"

interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: string
  status: "completed" | "pending" | "alert"
  href?: string
}

/**
 * Non-donation activity entries (assistance, volunteering) remain
 * static placeholders for now — those features already have their own
 * dedicated list pages. The donation entry is wired to real data via
 * {@link RecentDonationActivityItem} so it always reflects the user's
 * most recent contribution.
 */
const STATIC_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    title: "Emergency Food Ration Request Approved",
    description:
      "Coordination team verified entitlement for Sylhet Sadar ward 4.",
    timestamp: "2 hours ago",
    status: "completed",
    href: routes.account.assistance,
  },
  {
    id: "2",
    title: "Volunteer Mission Briefing Assigned",
    description: "Flood Relief Distribution Crew briefing starts at 9:00 AM.",
    timestamp: "5 hours ago",
    status: "pending",
    href: routes.account.volunteering,
  },
]

export function DashboardActivitySection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            Recent Activity & Updates
          </CardTitle>
          <CardDescription>
            Live timeline of your disaster relief claims, volunteer shifts, and
            contributions.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6 border-l border-border pl-4">
          {STATIC_ACTIVITIES.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
          <RecentDonationActivityItem />
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityRow({ activity }: { activity: ActivityItem }) {
  return (
    <div className="group relative">
      <span className="absolute top-1 -left-[21px] flex size-3 rounded-full bg-primary ring-4 ring-background" />
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            {activity.title}
            {activity.status === "completed" && (
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            )}
            {activity.status === "pending" && (
              <Clock className="size-4 text-amber-600 dark:text-amber-400" />
            )}
            {activity.status === "alert" && (
              <ShieldAlert className="size-4 text-destructive" />
            )}
          </h4>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {activity.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs whitespace-nowrap text-muted-foreground">
            {activity.timestamp}
          </span>
          {activity.href && (
            <Button
              size="icon-xs"
              variant="ghost"
              render={<Link href={activity.href} />}
              aria-label="View activity details"
            >
              <ArrowUpRight className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
