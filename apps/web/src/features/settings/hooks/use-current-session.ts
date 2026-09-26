"use client"

import { useQuery } from "@tanstack/react-query"
import type { UserSession } from "@shurokkha/contracts"

import { fetchCurrentSession } from "../api"

export const currentSessionQueryKey = ["settings", "session"] as const

export function useCurrentSession() {
  return useQuery<UserSession>({
    queryKey: [...currentSessionQueryKey],
    queryFn: fetchCurrentSession,
    staleTime: 60_000,
  })
}
