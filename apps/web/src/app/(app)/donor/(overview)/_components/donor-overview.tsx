import Link from "next/link"
import {
  CircleDollarSign,
  Gift,
  HandHeart,
  PackageCheck,
  Plus,
} from "lucide-react"

import {
  DashboardGrid,
  MetricStrip,
  MetricStripItem,
  WidgetFrame,
} from "@shurokkha/ui-patterns/dashboard"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"
import { Button } from "@shurokkha/ui/components/button"
import { Progress } from "@shurokkha/ui/components/progress"

import { routes } from "@/config/routes"

export function DonorOverview() {
  const metrics = [
    { value: "$4,840", label: "Total donated", icon: CircleDollarSign },
    { value: "12", label: "Campaigns supported", icon: HandHeart },
    { value: "86", label: "Families reached", icon: Gift },
    { value: "240", label: "Items delivered", icon: PackageCheck },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your giving at work"
        description="See how your support is reaching communities in need."
        actions={
          <Button
            nativeButton={false}
            size="lg"
            render={<Link href={routes.donor.donate} />}
          >
            <Plus data-icon="inline-start" /> Make a donation
          </Button>
        }
      />

      <MetricStrip columns={4}>
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
          title="Recent contributions"
          description="Your latest donations and delivery status."
          footer="All listed contributions are verified."
        >
          <div className="divide-y divide-border">
            {[
              ["Flood recovery fund", "$1,200", "Distributed"],
              ["Emergency food packs", "$640", "In transit"],
              ["Community shelter repairs", "$2,000", "Allocated"],
              ["Medical supply drive", "$1,000", "Delivered"],
            ].map(([name, amount, status]) => (
              <div
                key={name}
                className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
              >
                <CircleDollarSign className="size-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">{status}</p>
                </div>
                <p className="font-heading font-semibold tabular-nums">
                  {amount}
                </p>
              </div>
            ))}
          </div>
        </WidgetFrame>

        <WidgetFrame
          title="Featured campaign"
          description="Rebuild homes after the Riverside flood."
        >
          <div className="space-y-5">
            <Progress value={72}>
              <span className="text-sm font-medium">$36,000 raised</span>
              <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                72%
              </span>
            </Progress>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Goal: $50,000</span>
              <span>8 days left</span>
            </div>
            <Button
              nativeButton={false}
              render={<Link href={routes.donor.donate} />}
            >
              Support campaign
            </Button>
          </div>
        </WidgetFrame>
      </DashboardGrid>
    </div>
  )
}
