"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@shurokkha/ui/components/button"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"

import { adminRoutes } from "@/config/routes"
import { useEmergencyRequestsList } from "@/hooks/operations/use-emergency-requests"
import { useRescueTeams } from "@/hooks/operations/use-rescue-teams"
import { useTeamAssignments } from "@/hooks/operations/use-team-assignments"
import type { AssignmentStatus } from "@/hooks/operations/types"

const ASSIGNMENT_STATUS_OPTIONS: { value: AssignmentStatus; label: string }[] =
  [
    { value: "assigned", label: "Assigned" },
    { value: "on_route", label: "On Route" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ]

export function TeamAssignmentForm() {
  const router = useRouter()
  const { create } = useTeamAssignments()
  const { data: rescueTeams } = useRescueTeams()
  const emergencyRequests = useEmergencyRequestsList()

  const [teamId, setTeamId] = useState<string>("")
  const [requestId, setRequestId] = useState<string>("")
  const [status, setStatus] = useState<AssignmentStatus>("assigned")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedTeam = parseInt(
      teamId || String(rescueTeams[0]?.team_id || 1),
      10
    )
    const parsedRequest = parseInt(
      requestId || String(emergencyRequests[0]?.request_id || 1),
      10
    )

    if (!parsedTeam || !parsedRequest) return

    create.mutate(
      {
        team_id: parsedTeam,
        request_id: parsedRequest,
        status,
      },
      {
        onSuccess: () =>
          router.push(adminRoutes.operations.teamManagement.list),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="team_id">Select Rescue Team *</Label>
        <NativeSelect
          id="team_id"
          value={teamId || String(rescueTeams[0]?.team_id || "")}
          onChange={(e) => setTeamId(e.target.value)}
          required
        >
          {rescueTeams.map((t) => (
            <option key={t.team_id} value={t.team_id}>
              #{t.team_id} - {t.team_name} ({t.availability})
            </option>
          ))}
          {rescueTeams.length === 0 && (
            <option value="1">#1 - Dhaka Fire Service Alpha</option>
          )}
        </NativeSelect>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="request_id">Target Emergency Request *</Label>
        <NativeSelect
          id="request_id"
          value={requestId || String(emergencyRequests[0]?.request_id || "")}
          onChange={(e) => setRequestId(e.target.value)}
          required
        >
          {emergencyRequests.map((r) => (
            <option key={r.request_id} value={r.request_id}>
              Req #{r.request_id} - {r.citizen_name || "Citizen"} (
              {r.priority.toUpperCase()})
            </option>
          ))}
          {emergencyRequests.length === 0 && (
            <option value="1">Req #1 - Critical Rescue (Area #1)</option>
          )}
        </NativeSelect>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">Initial Assignment Status *</Label>
        <NativeSelect
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
        >
          {ASSIGNMENT_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      <Button type="submit" className="w-full" disabled={create.isPending}>
        {create.isPending ? "Assigning…" : "Create Team Assignment"}
      </Button>
    </form>
  )
}
