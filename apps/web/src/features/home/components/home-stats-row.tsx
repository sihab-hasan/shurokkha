"use client"

import {
  AlertOctagon,
  Building2,
  HeartHandshake,
  Users,
} from "lucide-react"

import { SectionHeader } from "@shurokkha/ui/layout/section-header"

import { usePublicAffectedAreas } from "@/features/affected-areas"
import { usePublicDisasters } from "@/features/disasters"
import { usePublicShelters } from "@/features/shelters"

import { HomeStatTile } from "./home-stat-tile"

/**
 * Live stats row at the top of the home page. Pulls from three public
 * hooks, computes the headline counts, and renders four `HomeStatTile`s.
 * Emits "—" while any of the three queries is pending so the row never
 * shows partial numbers.
 */
export function HomeStatsRow() {
  const disasters = usePublicDisasters()
  const shelters = usePublicShelters()
  const areas = usePublicAffectedAreas()

  const activeDisasters = (disasters.data?.data ?? []).filter(
    (d) => d.status === "active"
  )

  const openShelters = (shelters.data?.data ?? []).filter(
    (s) => s.status === "open"
  )

  const totalAffected = (disasters.data?.data ?? []).reduce(
    (sum, d) => sum + (d.total_affected_population ?? 0),
    0
  )

  const isPending =
    disasters.isPending || shelters.isPending || areas.isPending

  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="At a glance"
        title="Active response snapshot"
        description="Live numbers pulled from the coordination database."
        align="left"
        className="mb-0"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <HomeStatTile
          icon={<AlertOctagon className="size-4 text-primary" />}
          label="Active disasters"
          value={isPending ? "—" : String(activeDisasters.length)}
          href="/disasters"
        />
        <HomeStatTile
          icon={<Building2 className="size-4 text-primary" />}
          label="Open shelters"
          value={isPending ? "—" : String(openShelters.length)}
          href="/shelters"
        />
        <HomeStatTile
          icon={<Users className="size-4 text-primary" />}
          label="Population impacted"
          value={isPending ? "—" : totalAffected.toLocaleString()}
          href="/disasters"
        />
        <HomeStatTile
          icon={<HeartHandshake className="size-4 text-primary" />}
          label="Affected areas"
          value={isPending ? "—" : String((areas.data?.data ?? []).length)}
          href="/map"
        />
      </div>
    </section>
  )
}
