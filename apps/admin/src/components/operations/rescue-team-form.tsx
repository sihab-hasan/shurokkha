"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"

import { adminRoutes } from "@/config/routes"
import { useRescueTeams } from "@/hooks/operations/use-rescue-teams"
import type { RescueTeamAvailability } from "@/hooks/operations/types"

const TEAM_TYPE_OPTIONS = [
  "Search and Rescue",
  "Water Rescue",
  "Medical Support",
  "Logistics & Relief",
  "Fire & Rescue",
  "Helicopter Evacuation",
] as const

const AVAILABILITY_OPTIONS: {
  value: RescueTeamAvailability
  label: string
}[] = [
  { value: "available", label: "Available (Ready for assignment)" },
  { value: "busy", label: "Busy (Currently on field)" },
  { value: "offline", label: "Offline (Off duty / standby)" },
]

export function RescueTeamForm() {
  const router = useRouter()
  const { create } = useRescueTeams()

  const [teamName, setTeamName] = useState<string>("")
  const [teamType, setTeamType] = useState<string>(TEAM_TYPE_OPTIONS[0])
  const [availability, setAvailability] =
    useState<RescueTeamAvailability>("available")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) return

    create.mutate(
      {
        team_name: teamName.trim(),
        team_type: teamType,
        availability,
      },
      {
        onSuccess: () => {
          setTeamName("")
          router.push(adminRoutes.operations.rescueTeams.list)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="team_name">Team Name / Unit *</Label>
        <Input
          id="team_name"
          placeholder="e.g. Sylhet Quick Response Team 4"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="team_type">Specialization / Type *</Label>
        <NativeSelect
          id="team_type"
          value={teamType}
          onChange={(e) => setTeamType(e.target.value)}
        >
          {TEAM_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="availability">Operational Status *</Label>
        <NativeSelect
          id="availability"
          value={availability}
          onChange={(e) =>
            setAvailability(e.target.value as RescueTeamAvailability)
          }
        >
          {AVAILABILITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      <Button type="submit" className="w-full" disabled={create.isPending}>
        {create.isPending ? "Registering…" : "Add Rescue Team"}
      </Button>
    </form>
  )
}
