"use client"

import { useQuery } from "@tanstack/react-query"

import { getShurokkhaApi } from "@/lib/api"

/**
 * List affected areas visible to the public. Used by `/map` and the
 * home page. Returns critical-severity-first ordering from the backend.
 */
export function usePublicAffectedAreas() {
  return useQuery({
    queryKey: ["public", "affected-areas"],
    queryFn: async () => {
      const response = await getShurokkhaApi().public.affectedAreas.list()
      return response
    },
  })
}
