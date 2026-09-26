"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import type { ApiResource, AssistanceRequestStats } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

/**
 * Cached fetch for the dashboard stats bucket counts. Stats change slowly
 * so we use a longer `staleTime` and disable focus refetch.
 */
export function useAssistanceStats(): UseQueryResult<
  ApiResource<AssistanceRequestStats>,
  Error
> {
  return useQuery<ApiResource<AssistanceRequestStats>, Error>({
    queryKey: ["assistance", "stats"],
    queryFn: () => getShurokkhaApi().resources.assistanceRequests.stats(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })
}
