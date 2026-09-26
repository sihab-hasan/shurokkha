"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import type { ApiResource, DonationStats } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

/**
 * Cached fetch for the donations stats bucket counts. Stats change slowly
 * so we use a longer `staleTime` and disable focus refetch.
 */
export function useDonationsStats(): UseQueryResult<
  ApiResource<DonationStats>,
  Error
> {
  return useQuery<ApiResource<DonationStats>, Error>({
    queryKey: ["donations", "stats"],
    queryFn: () => getShurokkhaApi().resources.donations.stats(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })
}
