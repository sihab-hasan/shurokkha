"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"

import { adminRoutes } from "@/config/routes"
import { useAffectedAreas } from "@/hooks/operations/use-affected-areas"
import { useDisasters } from "@/hooks/operations/use-disasters"
import type { AffectedAreaSeverity } from "@/hooks/operations/types"

const SEVERITY_OPTIONS: AffectedAreaSeverity[] = [
  "Critical",
  "High",
  "Medium",
  "Low",
]

export function AffectedAreaForm() {
  const router = useRouter()
  const { create } = useAffectedAreas()
  const disasters = useDisasters()

  const [disasterId, setDisasterId] = useState<string>("")
  const [locationId, setLocationId] = useState<string>("101")
  const [population, setPopulation] = useState<string>("")
  const [severity, setSeverity] = useState<AffectedAreaSeverity>("Critical")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedDisaster = parseInt(
      disasterId || String(disasters[0]?.disaster_id || 1),
      10
    )
    const parsedPopulation = parseInt(population, 10)
    const parsedLocation = locationId ? parseInt(locationId, 10) : undefined

    if (!parsedPopulation || parsedPopulation <= 0) return

    create.mutate(
      {
        disaster_id: parsedDisaster,
        location_id: parsedLocation,
        affected_population: parsedPopulation,
        severity,
      },
      {
        onSuccess: () => {
          setPopulation("")
          router.push(adminRoutes.operations.affectedAreas.list)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="disaster_id">Linked Disaster *</Label>
        <NativeSelect
          id="disaster_id"
          value={disasterId || String(disasters[0]?.disaster_id || "")}
          onChange={(e) => setDisasterId(e.target.value)}
          required
        >
          {disasters.map((d) => (
            <option key={d.disaster_id} value={d.disaster_id}>
              #{d.disaster_id} - {d.disaster_name} ({d.severity})
            </option>
          ))}
          {disasters.length === 0 && (
            <option value="1">#1 - Sylhet Flash Flood</option>
          )}
        </NativeSelect>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location_id">Location ID (Zone/Geo Code)</Label>
        <Input
          id="location_id"
          type="number"
          placeholder="e.g. 101, 102, 201"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="population">Affected Population (People) *</Label>
        <div className="relative">
          <Users className="absolute top-3 left-3 size-4 text-muted-foreground" />
          <Input
            id="population"
            type="number"
            min="1"
            placeholder="e.g. 25000"
            value={population}
            onChange={(e) => setPopulation(e.target.value)}
            className="pl-9"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="severity">Impact Severity *</Label>
        <NativeSelect
          id="severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as AffectedAreaSeverity)}
        >
          {SEVERITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </NativeSelect>
      </div>

      <Button type="submit" className="w-full" disabled={create.isPending}>
        {create.isPending ? "Inserting…" : "Insert Affected Area"}
      </Button>
    </form>
  )
}
