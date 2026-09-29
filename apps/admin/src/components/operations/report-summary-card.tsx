"use client"

import {
  AlertOctagon,
  HeartHandshake,
  Home,
  MapPin,
  Megaphone,
  Siren,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react"

import { Card, CardContent } from "@shurokkha/ui/components/card"

import type { ReportSummaryCard } from "@/hooks/operations/types"

interface MetricProps {
  label: string
  value: string | number | undefined
  icon: React.ComponentType<{ className?: string }>
  accent?: string
}

function Metric({
  label,
  value,
  icon: Icon,
  accent = "text-primary",
}: MetricProps) {
  const display =
    value === undefined || value === null
      ? "—"
      : typeof value === "number"
        ? value.toLocaleString()
        : value
  return (
    <Card className="border-primary/20 shadow-sm">
      <CardContent className="flex items-center gap-4 py-5">
        <div className={`rounded-lg bg-primary/10 p-2 ${accent}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="text-2xl font-semibold">{display}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ReportSummaryCards({
  data,
}: {
  data: ReportSummaryCard | undefined
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Metric
        label="Active Disasters"
        value={data?.active_disasters}
        icon={AlertOctagon}
        accent="text-destructive"
      />
      <Metric
        label="Affected Population"
        value={data?.total_affected_population}
        icon={Users}
      />
      <Metric
        label="Active Shelters"
        value={data?.active_shelters}
        icon={Home}
      />
      <Metric
        label="Shelter Capacity"
        value={data?.total_shelter_capacity}
        icon={Home}
      />
      <Metric
        label="Shelter Occupancy"
        value={data?.total_shelter_occupancy}
        icon={Home}
      />
      <Metric
        label="Active Rescue Teams"
        value={data?.active_rescue_teams}
        icon={HeartHandshake}
      />
      <Metric
        label="Open Emergency Requests"
        value={data?.open_emergency_requests}
        icon={Siren}
        accent="text-destructive"
      />
      <Metric
        label="Total Donations"
        value={data?.total_donations}
        icon={Wallet}
      />
      <Metric
        label="Donation Amount"
        value={data?.total_donation_amount}
        icon={Wallet}
      />
      <Metric
        label="Total Volunteers"
        value={data?.total_volunteers}
        icon={UserPlus}
      />
      <Metric
        label="Pending Volunteer Apps"
        value={data?.pending_volunteer_applications}
        icon={UserPlus}
      />
      <Metric label="Affected Areas" value={undefined} icon={MapPin} />
      <Metric label="Active Alerts" value={undefined} icon={Megaphone} />
    </div>
  )
}
