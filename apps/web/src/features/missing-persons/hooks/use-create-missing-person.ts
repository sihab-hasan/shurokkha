"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  MissingPersonReportInput,
  MissingPersonReportRecord,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

interface CreateMissingPersonVariables {
  input: MissingPersonReportInput
  photo?: File | null
}

/**
 * Files a new missing-person report and invalidates the list cache so any
 * cached page (across every filter variant) refetches on next render.
 *
 * Note: missing-persons has no stats endpoint, so only the list is
 * invalidated.
 */
export function useCreateMissingPerson() {
  const queryClient = useQueryClient()

  return useMutation<
    MissingPersonReportRecord,
    Error,
    CreateMissingPersonVariables
  >({
    mutationFn: async ({ input, photo }) => {
      const response = await getShurokkhaApi().resources.missingPersons.create(
        input,
        photo
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missing-persons", "list"] })
    },
  })
}
