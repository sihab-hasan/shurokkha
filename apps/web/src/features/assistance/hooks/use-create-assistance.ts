"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  AssistanceRequestInput,
  AssistanceRequestRecord,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

interface CreateAssistanceContext {
  previousList: unknown[] | undefined
  previousStats: unknown | undefined
}

/**
 * Creates a new assistance request and invalidates every cached query that
 * could go stale because of it:
 *
 * - `assistance/list/*` — the affected list (all filter variants)
 * - `assistance/stats` — dashboard KPI counts
 *
 * On error, the previous cache snapshots are NOT restored — the user can
 * retry safely because the network call never landed.
 */
export function useCreateAssistance() {
  const queryClient = useQueryClient()

  return useMutation<
    AssistanceRequestRecord,
    Error,
    AssistanceRequestInput,
    CreateAssistanceContext
  >({
    mutationFn: async (input) => {
      const response =
        await getShurokkhaApi().resources.assistanceRequests.create(input)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistance", "list"] })
      queryClient.invalidateQueries({ queryKey: ["assistance", "stats"] })
    },
  })
}
