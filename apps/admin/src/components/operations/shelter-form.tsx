"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"

import { SHELTER_STATUSES } from "@shurokkha/contracts"

import { adminRoutes } from "@/config/routes"
import { useAffectedAreas } from "@/hooks/operations/use-affected-areas"
import { useShelters } from "@/hooks/operations/use-shelters"
import type { ShelterStatus } from "@/hooks/operations/types"

export interface ShelterFormProps {
  /** When set, the form runs in "edit" mode and pre-fills from this row. */
  initial?: {
    shelter_id: number
    shelter_name: string
    capacity: number
    occupancy: number
    status: string
    area_id: number | null
  }
}

export function ShelterForm({ initial }: ShelterFormProps) {
  const router = useRouter()
  const { create, update } = useShelters()
  const areas = useAffectedAreas()

  const [shelterName, setShelterName] = useState(initial?.shelter_name ?? "")
  const [capacity, setCapacity] = useState<string>(
    initial?.capacity != null ? String(initial.capacity) : ""
  )
  const [occupancy, setOccupancy] = useState<string>(
    initial?.occupancy != null ? String(initial.occupancy) : "0"
  )
  const [status, setStatus] = useState<ShelterStatus>(
    (initial?.status as ShelterStatus) ?? "open"
  )
  const [areaId, setAreaId] = useState<string>(
    initial?.area_id != null ? String(initial.area_id) : ""
  )

  useEffect(() => {
    if (initial) {
      setShelterName(initial.shelter_name)
      setCapacity(String(initial.capacity))
      setOccupancy(String(initial.occupancy))
      setStatus(initial.status as ShelterStatus)
      setAreaId(initial.area_id != null ? String(initial.area_id) : "")
    }
  }, [initial])

  const isEdit = Boolean(initial)
  const pending = isEdit ? update.isPending : create.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!shelterName || !capacity) return

    const payload = {
      shelter_name: shelterName,
      capacity: Number(capacity),
      occupancy: Number(occupancy || 0),
      status,
      area_id: areaId ? Number(areaId) : null,
    }

    if (initial) {
      update.mutate(
        { id: initial.shelter_id, input: payload },
        {
          onSuccess: () =>
            router.push(
              adminRoutes.operations.shelters.detail(initial.shelter_id)
            ),
        }
      )
    } else {
      create.mutate(payload, {
        onSuccess: () => router.push(adminRoutes.operations.shelters.list),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="shelter_name">Shelter Name *</Label>
        <Input
          id="shelter_name"
          value={shelterName}
          onChange={(e) => setShelterName(e.target.value)}
          placeholder="Sylhet District School Shelter"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            type="number"
            min="0"
            step="1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="200"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="occupancy">Current Occupancy</Label>
          <Input
            id="occupancy"
            type="number"
            min="0"
            step="1"
            value={occupancy}
            onChange={(e) => setOccupancy(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status *</Label>
          <NativeSelect
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ShelterStatus)}
          >
            {SHELTER_STATUSES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="area_id">Affected Area</Label>
          <NativeSelect
            id="area_id"
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
          >
            <option value="">— Unassigned —</option>
            {areas.data.map((a) => (
              <option key={a.area_id} value={a.area_id}>
                #{a.area_id} — severity {a.severity} ({a.affected_population})
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Shelter"}
      </Button>
    </form>
  )
}
