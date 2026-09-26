"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  MissingPersonReportRecord,
  PaginatedResource,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

type MissingPersonListPage = PaginatedResource<MissingPersonReportRecord>

interface DeleteMissingPersonContext {
  previousLists: Array<[readonly unknown[], MissingPersonListPage | undefined]>
}

/**
 * Soft-deletes a missing-person report and removes it from every cached
 * list page immediately (optimistic), so the row vanishes the instant the
 * user confirms the destructive action.
 *
 * The list query stores a `PaginatedResource` (object with `data` and
 * `meta`), so we patch the wrapper object's `.data` field rather than
 * mutating an array directly.
 *
 * On error, the captured snapshots are restored.
 */
export function useDeleteMissingPerson() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: string }, DeleteMissingPersonContext>({
    mutationFn: async ({ id }) => {
      await getShurokkhaApi().resources.missingPersons.remove(id)
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["missing-persons", "list"] })

      const previousLists = queryClient.getQueriesData<MissingPersonListPage>({
        queryKey: ["missing-persons", "list"],
      }) as Array<[readonly unknown[], MissingPersonListPage | undefined]>

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
      queryClient.invalidateQueries({ queryKey: ["missing-persons", "list"] })
    },
  })
}
