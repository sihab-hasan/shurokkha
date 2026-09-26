"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  AssistanceRequestInput,
  AssistanceRequestRecord,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

/**
 * Updates an existing assistance request. Invalidates every cached query
 * that could show stale data after the edit:
 *
 * - `assistance/list/*` — list views
 * - `assistance/stats` — KPI counts (status may have changed)
 * - `assistance/get/<id>` — the detail view that just rendered the form
 */
export function useUpdateAssistance() {
  const queryClient = useQueryClient()

  return useMutation<
    AssistanceRequestRecord,
    Error,
    { id: string; input: Partial<AssistanceRequestInput> }
  >({
    mutationFn: async ({ id, input }) => {
      const response =
        await getShurokkhaApi().resources.assistanceRequests.update(id, input)
      return response.data
    },
    onSuccess: (record) => {
      queryClient.invalidateQueries({ queryKey: ["assistance", "list"] })
      queryClient.invalidateQueries({ queryKey: ["assistance", "stats"] })
      queryClient.invalidateQueries({
        queryKey: ["assistance", "get", record.id],
      })
    },
  })
}
