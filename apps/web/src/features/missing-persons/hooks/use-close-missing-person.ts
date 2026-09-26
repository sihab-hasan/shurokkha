"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  MissingPersonReportRecord,
  PaginatedResource,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

type MissingPersonListPage = PaginatedResource<MissingPersonReportRecord>

interface CloseMissingPersonVariables {
  id: string
  located: boolean
}

/**
 * Closes (or marks located) a missing-person report. The server response
 * carries the updated record with the new status — we patch it into the
 * `.data` array of every cached list page so the row's status badge
 * updates instantly, and the detail modal sees the same update via its
 * own state.
 *
 * The list query stores a `PaginatedResource`, so we patch the wrapper
 * object's `.data` field rather than mutating an array directly.
 */
export function useCloseMissingPerson() {
  const queryClient = useQueryClient()

  return useMutation<
    MissingPersonReportRecord,
    Error,
    CloseMissingPersonVariables
  >({
    mutationFn: async ({ id, located }) => {
      const response = await getShurokkhaApi().resources.missingPersons.close(
        id,
        located
      )
      return response.data
    },
    onSuccess: (updated) => {
      queryClient.setQueriesData<MissingPersonListPage | undefined>(
        { queryKey: ["missing-persons", "list"] },
        (current) => {
          if (!current?.data) return current
          return {
            ...current,
            data: current.data.map((row) =>
              row.id === updated.id ? updated : row
            ),
          }
        }
      )
    },
  })
}
