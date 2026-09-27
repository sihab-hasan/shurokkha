"use client"

import { useQuery } from "@tanstack/react-query"

import { getShurokkhaApi } from "@/lib/api"

import type { PublicShelterRecord } from "@shurokkha/contracts"

interface UsePublicSheltersOptions {
  status?: PublicShelterRecord["status"]
  onlyAvailable?: boolean
}

/**
 * List shelters visible to the public. Used by `/shelters` and `/map`.
 * `onlyAvailable=true` hides shelters at capacity.
 */
export function usePublicShelters(options: UsePublicSheltersOptions = {}) {
  return useQuery({
    queryKey: ["public", "shelters", options],
    queryFn: async () => {
      const response = await getShurokkhaApi().public.shelters.list({
        status: options.status ?? undefined,
        only_available: options.onlyAvailable,
      })
      return response
    },
  })
}
