"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  AssistanceRequestRecord,
  PaginatedResource,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

type AssistanceListPage = PaginatedResource<AssistanceRequestRecord>

interface DeleteAssistanceContext {
  previousLists: Array<[readonly unknown[], AssistanceListPage | undefined]>
}

/**
 * Soft-deletes an assistance request and removes it from every cached list
 * page immediately (optimistic) so the user sees the row vanish without a
 * round-trip wait.
 *
 * The list query stores a `PaginatedResource` (an object with `data` and
 * `meta`), NOT a bare array — so we patch the `.data` field of each
 * cached page, never call `.filter` on the wrapper object itself.
 *
 * On success, the list and stats caches are invalidated so the server
 * becomes the source of truth on the next fetch.
 *
 * On error, the snapshots captured before the optimistic update are
 * restored so the UI doesn't lose the row permanently.
 */
export function useDeleteAssistance() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: string }, DeleteAssistanceContext>({
    mutationFn: async ({ id }) => {
      await getShurokkhaApi().resources.assistanceRequests.remove(id)
    },
    onMutate: async ({ id }) => {
      // Cancel in-flight queries so they don't overwrite our optimistic update.
      await queryClient.cancelQueries({ queryKey: ["assistance", "list"] })

      // Snapshot every cached list page so we can restore on error.
      const previousLists = queryClient.getQueriesData<AssistanceListPage>({
        queryKey: ["assistance", "list"],
      }) as Array<[readonly unknown[], AssistanceListPage | undefined]>

      // Optimistically strip the deleted row from every page. Each
      // cached page is the paginated wrapper object, so we patch its
      // `.data` array in place.
      for (const [key, page] of previousLists) {
        if (!page?.data) continue
        queryClient.setQueryData(key, {
          ...page,
          data: page.data.filter((row) => row.id !== id),
        })
      }

      return { previousLists }
    },
    onError: (_error, _variables, context) => {
      if (!context) return
      for (const [key, page] of context.previousLists) {
        queryClient.setQueryData(key, page)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistance", "list"] })
      queryClient.invalidateQueries({ queryKey: ["assistance", "stats"] })
    },
  })
}
