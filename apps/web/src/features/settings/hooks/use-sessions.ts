"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { fetchAllSessions, revokeAllSessions } from "../api"

export const sessionsQueryKey = ["settings", "sessions"] as const

export function useSessionsList() {
  return useQuery({
    queryKey: [...sessionsQueryKey],
    queryFn: fetchAllSessions,
    staleTime: 60_000,
  })
}

export function useRevokeAllSessions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeAllSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...sessionsQueryKey] })
    },
  })
}
