"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  MissingPersonReportInput,
  MissingPersonReportRecord,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

interface UpdateMissingPersonVariables {
  id: string
  input: MissingPersonReportInput
  photo?: File | null
  removePhoto?: boolean
}

/**
 * Updates an existing missing-person report. Invalidates every cached list
 * page so the next render reflects the edit (status, name, etc.).
 */
export function useUpdateMissingPerson() {
  const queryClient = useQueryClient()

  return useMutation<
    MissingPersonReportRecord,
    Error,
    UpdateMissingPersonVariables
  >({
    mutationFn: async ({ id, input, photo, removePhoto }) => {
      const response = await getShurokkhaApi().resources.missingPersons.update(
        id,
        input,
        {
          photo,
          removePhoto,
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missing-persons", "list"] })
    },
  })
}
