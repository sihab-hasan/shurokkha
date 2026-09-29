"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import type { RescueTeamInput } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { RescueTeamAdminRecord } from "./types"

export function useRescueTeams() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.rescueTeams.list(),
    queryFn: async () => {
      const res = await api.admin.rescueTeams.list()
      return (res.data ?? []) as unknown as RescueTeamAdminRecord[]
    },
  })

  const create = useMutation({
    mutationFn: async (payload: RescueTeamInput) =>
      api.admin.rescueTeams.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.rescueTeams.all(),
      })
      toast.success("Rescue Team registered successfully!")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to register rescue team.")
    },
  })

  const remove = useMutation({
    mutationFn: async (teamId: number) => api.admin.rescueTeams.remove(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.rescueTeams.all(),
      })
      toast.success("Rescue Team removed.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to remove rescue team.")
    },
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    create,
    remove,
  }
}

/**
 * Look up a single rescue-team record plus its loading + delete state.
 * Used by detail pages; returns a stable reference when `teamId` is undefined.
 */
export function useRescueTeam(teamId: number | undefined) {
  const { data, isLoading, remove } = useRescueTeams()
  const team =
    teamId == null ? undefined : data.find((row) => row.team_id === teamId)
  return { team, isLoading, remove }
}
