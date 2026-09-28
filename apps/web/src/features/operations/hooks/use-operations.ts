"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"
import { getShurokkhaApi } from "@/lib/api"

export interface AffectedAreaAdminRecord {
  area_id: number
  disaster_id: number
  location_id: number | null
  affected_population: number
  severity: string
  disaster_name?: string
  disaster_severity?: string
  disaster_status?: string
  created_at: string | null
}

export interface RescueTeamAdminRecord {
  team_id: number
  team_name: string
  team_type: string
  availability: "available" | "busy" | "offline"
  total_assignments?: number
  created_at: string | null
  updated_at: string | null
}

export interface AssignmentAdminRecord {
  assignment_id: number
  team_id: number
  request_id: number
  status: "assigned" | "on_route" | "completed" | "cancelled"
  assignment_at: string | null
  team_name?: string
  team_type?: string
  team_availability?: string
  request_priority?: string
  request_status?: string
  request_type?: string
  citizen_name?: string
  citizen_phone?: string
}

export interface EmergencyRequestAdminRecord {
  request_id: number
  user_id: number
  area_id: number
  priority: string
  status: string
  request_at: string
  citizen_name?: string
  citizen_phone?: string
}

export interface DisasterOption {
  disaster_id: number
  disaster_name: string
  severity: string
  status: string
}

export function useOperationsData() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  // 1. Affected Areas
  const affectedAreasQuery = useQuery({
    queryKey: ["admin", "affected-areas"],
    queryFn: async () => {
      const res = await api.admin.affectedAreas.list()
      return (res.data ?? []) as unknown as AffectedAreaAdminRecord[]
    },
  })

  const createAffectedAreaMutation = useMutation({
    mutationFn: async (payload: {
      disaster_id: number
      location_id?: number
      affected_population: number
      severity: string
    }) => {
      return await api.admin.affectedAreas.create({
        disaster_id: payload.disaster_id,
        location_id: payload.location_id ?? 101,
        affected_population: payload.affected_population,
        severity: payload.severity as "Critical" | "High" | "Medium" | "Low",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "affected-areas"] })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Affected Area added successfully!")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create affected area.")
    },
  })

  const deleteAffectedAreaMutation = useMutation({
    mutationFn: async (areaId: number) => {
      return await api.admin.affectedAreas.remove(areaId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "affected-areas"] })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Affected Area deleted.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete affected area.")
    },
  })

  // 2. Rescue Teams
  const rescueTeamsQuery = useQuery({
    queryKey: ["admin", "rescue-teams"],
    queryFn: async () => {
      const res = await api.admin.rescueTeams.list()
      return (res.data ?? []) as unknown as RescueTeamAdminRecord[]
    },
  })

  const createRescueTeamMutation = useMutation({
    mutationFn: async (payload: {
      team_name: string
      team_type: string
      availability: "available" | "busy" | "offline"
    }) => {
      return await api.admin.rescueTeams.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rescue-teams"] })
      toast.success("Rescue Team registered successfully!")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to register rescue team.")
    },
  })

  const deleteRescueTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      return await api.admin.rescueTeams.remove(teamId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rescue-teams"] })
      toast.success("Rescue Team removed.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to remove rescue team.")
    },
  })

  // 3. Team Assignments
  const assignmentsQuery = useQuery({
    queryKey: ["admin", "assignments"],
    queryFn: async () => {
      const res = await api.admin.assignments.list()
      return (res.data ?? []) as unknown as AssignmentAdminRecord[]
    },
  })

  const createAssignmentMutation = useMutation({
    mutationFn: async (payload: {
      team_id: number
      request_id: number
      status: "assigned" | "on_route" | "completed" | "cancelled"
    }) => {
      return await api.admin.assignments.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "assignments"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "rescue-teams"] })
      toast.success("Team assigned to emergency request successfully!")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to assign team.")
    },
  })

  const updateAssignmentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await api.admin.assignments.updateStatus(id, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "assignments"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "rescue-teams"] })
      toast.success("Assignment status updated.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update assignment status.")
    },
  })

  const deleteAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: number) => {
      return await api.admin.assignments.remove(assignmentId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "assignments"] })
      toast.success("Assignment deleted.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete assignment.")
    },
  })

  // Helper lists for dropdowns
  const disastersQuery = useQuery({
    queryKey: ["admin", "disasters-list"],
    queryFn: async () => {
      const res = await api.admin.disasters.list()
      return (res.data ?? []) as unknown as DisasterOption[]
    },
  })

  const emergencyRequestsQuery = useQuery({
    queryKey: ["admin", "emergency-requests-list"],
    queryFn: async () => {
      const res = await fetch(
        "http://127.0.0.1:8000/api/v1/admin/emergency-requests"
      )
      const json = await res.json()
      return (json.data ?? []) as EmergencyRequestAdminRecord[]
    },
  })

  return {
    affectedAreas: {
      data: affectedAreasQuery.data ?? [],
      isLoading: affectedAreasQuery.isLoading,
      create: createAffectedAreaMutation,
      remove: deleteAffectedAreaMutation,
    },
    rescueTeams: {
      data: rescueTeamsQuery.data ?? [],
      isLoading: rescueTeamsQuery.isLoading,
      create: createRescueTeamMutation,
      remove: deleteRescueTeamMutation,
    },
    assignments: {
      data: assignmentsQuery.data ?? [],
      isLoading: assignmentsQuery.isLoading,
      create: createAssignmentMutation,
      updateStatus: updateAssignmentStatusMutation,
      remove: deleteAssignmentMutation,
    },
    disasters: disastersQuery.data ?? [],
    emergencyRequests: emergencyRequestsQuery.data ?? [],
  }
}
