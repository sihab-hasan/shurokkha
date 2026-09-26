"use client"

import { useQuery } from "@tanstack/react-query"

import { fetchLoginAudits } from "../api"

export const loginAuditsQueryKey = ["settings", "login-audits"] as const

export function useLoginAudits(limit = 20) {
  return useQuery({
    queryKey: [...loginAuditsQueryKey, limit],
    queryFn: () => fetchLoginAudits(limit),
    staleTime: 60_000,
  })
}
