"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  AssistanceRequestRecord,
  AssistanceRequestStatus,
  PaginatedResource,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

type AssistanceListPage = PaginatedResource<AssistanceRequestRecord>

interface CancelAssistanceVariables {
  id: string
}

/**
 * Cancels an assistance request. The server response includes the updated
 * record (status flipped to "cancelled"); we patch that record into the
 * `.data` array of every cached list page so the status badge updates
 * instantly. The stats cache is invalidated because the cancelled bucket's
 * count changes.
 *
 * The list query stores a `PaginatedResource` (an object with `data` and
 * `meta`), so we patch the wrapper object's `.data` field rather than
 * mutating an array directly.
 */
export function useCancelAssistance() {
  const queryClient = useQueryClient()

  return useMutation<AssistanceRequestRecord, Error, CancelAssistanceVariables>(
    {
      mutationFn: async ({ id }) => {
        const response =
          await getShurokkhaApi().resources.assistanceRequests.cancel(id)
        return response.data
      },
      onSuccess: (updated) => {
        const updatedStatus: AssistanceRequestStatus = updated.status

        // Patch the record into every cached list page.
        queryClient.setQueriesData<AssistanceListPage | undefined>(
          { queryKey: ["assistance", "list"] },
          (current) => {
            if (!current?.data) return current
            return {
              ...current,
              data: current.data.map((row) =>
                row.id === updated.id
                  ? ({
                      ...row,
                      status: updatedStatus,
                    } as AssistanceRequestRecord)
                  : row
              ),
            }
          }
        )

        // Stats cache is sensitive to status changes — refetch it.
        queryClient.invalidateQueries({ queryKey: ["assistance", "stats"] })
      },
    }
  )
}
