"use client"

import { AlertOctagon, HeartHandshake, Home, Siren, Wallet } from "lucide-react"

import { Card, CardContent } from "@shurokkha/ui/components/card"

import { usePublicDisasters } from "@/features/disasters/hooks/use-disasters"
import { usePublicShelters } from "@/features/shelters/hooks/use-shelters"
import { useDonationsStats } from "@/features/donations/hooks/use-donations-stats"

interface MetricProps {
  label: string
  value: string | number | null
  icon: React.ComponentType<{ className?: string }>
  accent?: string
}

function Metric({
  label,
  value,
  icon: Icon,
  accent = "text-primary",
}: MetricProps) {
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
          <p className="text-2xl font-semibold">
            {value === null
              ? "—"
              : typeof value === "number"
                ? value.toLocaleString()
                : value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function TransparencyLiveStats() {
  const { data: disastersData } = usePublicDisasters()
  const { data: sheltersData } = usePublicShelters()
  const statsQuery = useDonationsStats()
  const donationsStats = statsQuery.data?.data

  const disasters = disastersData?.data ?? []
  const shelters = sheltersData?.data ?? []
  const activeDisasters = disasters.filter((d) => d.status === "active").length
  const openShelters = shelters.filter((s) => s.status === "open").length
  const totalOccupancy = shelters.reduce(
    (sum, s) => sum + (s.occupancy ?? 0),
    0
  )
  const totalCapacity = shelters.reduce((sum, s) => sum + (s.capacity ?? 0), 0)
  const donationAmount =
    donationsStats && typeof donationsStats.lifetime_sum === "number"
      ? donationsStats.lifetime_sum
      : null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Metric
        label="Active Disasters"
        value={activeDisasters}
        icon={AlertOctagon}
        accent="text-destructive"
      />
      <Metric label="Open Shelters" value={openShelters} icon={Home} />
      <Metric
        label="Shelter Capacity"
        value={`${totalOccupancy.toLocaleString()} / ${totalCapacity.toLocaleString()}`}
        icon={HeartHandshake}
      />
      <Metric
        label="Open Emergency Requests"
        value={null}
        icon={Siren}
        accent="text-destructive"
      />
      <Metric label="Donation Total" value={donationAmount} icon={Wallet} />
      <Metric label="Verified Volunteers" value={null} icon={HeartHandshake} />
    </div>
  )
}
