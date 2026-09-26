"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  cancelAccountDeletion,
  fetchAccountDeletionRequest,
  requestAccountDeletion,
} from "../api"

export const accountDeletionQueryKey = ["settings", "account-deletion"] as const

export function useAccountDeletionRequest() {
  return useQuery({
    queryKey: [...accountDeletionQueryKey],
    queryFn: fetchAccountDeletionRequest,
    staleTime: 30_000,
  })
}

export function useRequestAccountDeletion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: requestAccountDeletion,
    onSuccess: (data) => {
      queryClient.setQueryData([...accountDeletionQueryKey], data)
    },
  })
}

export function useCancelAccountDeletion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelAccountDeletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...accountDeletionQueryKey] })
    },
  })
}
