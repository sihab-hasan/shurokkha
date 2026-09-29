"use client"

import { useQuery } from "@tanstack/react-query"

import { getShurokkhaApi } from "@/lib/api"

import type { PublicFundraiseListParams } from "@shurokkha/contracts"

/**
 * Public list of approved fundraises, optionally filtered by status
 * (e.g. "active"). Used by the transparency page to show live
 * accountability metrics.
 */
export function usePublicFundraises(params: PublicFundraiseListParams = {}) {
  return useQuery({
    queryKey: ["public", "fundraises", params],
    queryFn: async () => {
      const res = await getShurokkhaApi().public.fundraises.list(params)
      return res
    },
  })
}
