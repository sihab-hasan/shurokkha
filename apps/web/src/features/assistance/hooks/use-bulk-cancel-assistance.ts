"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { BulkActionResult } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

/**
 * Cancels many assistance requests in a single round-trip.
 *
 * On success, every cached `assistance/list/*` query (including pagination
 * variants) is invalidated, plus the dashboard stats. The mutation result
 * carries per-id buckets so the caller can render a partial-success toast
 * (e.g. "12 cancelled, 2 skipped — already terminal").
 *
 * The optimistic update intentionally does NOT remove rows from the cache.
 * Cancelling flips a status; the next refetch is the source of truth, and
 * removing rows client-side could leak them back in as duplicates if the
 * server returns a different page shape.
 */
export function useBulkCancelAssistance() {
  const queryClient = useQueryClient()

  return useMutation<BulkActionResult, Error, { ids: string[] }>({
    mutationFn: async ({ ids }) => {
      const response =
        await getShurokkhaApi().resources.assistanceRequests.bulkCancel(ids)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistance", "list"] })
      queryClient.invalidateQueries({ queryKey: ["assistance", "stats"] })
    },
  })
}
