"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import type { TeamAssignmentInput } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { AssignmentAdminRecord, AssignmentStatus } from "./types"

export function useTeamAssignments() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.assignments.list(),
    queryFn: async () => {
      const res = await api.admin.assignments.list()
      return (res.data ?? []) as unknown as AssignmentAdminRecord[]
    },
  })

  const create = useMutation({
    mutationFn: async (payload: TeamAssignmentInput) =>
      api.admin.assignments.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.assignments.all(),
      })
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.rescueTeams.all(),
      })
      toast.success("Team assigned to emergency request successfully!")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to assign team.")
    },
  })

  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number
      status: AssignmentStatus
    }) => api.admin.assignments.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.assignments.all(),
      })
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.rescueTeams.all(),
      })
      toast.success("Assignment status updated.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update assignment status.")
    },
  })

  const remove = useMutation({
    mutationFn: async (assignmentId: number) =>
      api.admin.assignments.remove(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.assignments.all(),
      })
      toast.success("Assignment deleted.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete assignment.")
    },
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    create,
    updateStatus,
    remove,
  }
}

/**
 * Look up a single team-assignment record plus its loading + delete state.
 * Used by detail pages; returns a stable reference when `assignmentId` is undefined.
 */
export function useTeamAssignment(assignmentId: number | undefined) {
  const { data, isLoading, remove } = useTeamAssignments()
  const assignment =
    assignmentId == null
      ? undefined
      : data.find((row) => row.assignment_id === assignmentId)
  return { assignment, isLoading, remove }
}
