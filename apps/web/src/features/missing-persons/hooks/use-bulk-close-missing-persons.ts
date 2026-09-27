"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { BulkActionResult } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

/**
 * Closes many missing-person reports in a single round-trip.
 *
 * On success, every cached `missing-persons/list/*` query is invalidated.
 * The mutation result carries per-id buckets so the caller can render a
 * partial-success toast.
 *
 * Note: there is no `missing-persons/stats` endpoint to invalidate — the
 * dashboard tiles are derived from the cached list query.
 */
export function useBulkCloseMissingPersons() {
  const queryClient = useQueryClient()

  return useMutation<BulkActionResult, Error, { ids: string[] }>({
    mutationFn: async ({ ids }) => {
      const response =
        await getShurokkhaApi().resources.missingPersons.bulkClose(ids)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missing-persons", "list"] })
    },
  })
}
