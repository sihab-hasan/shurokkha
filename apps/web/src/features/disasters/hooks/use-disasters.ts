"use client"

import { useQuery } from "@tanstack/react-query"

import { getShurokkhaApi } from "@/lib/api"

import type { PublicDisasterRecord } from "@shurokkha/contracts"

interface UsePublicDisastersOptions {
  status?: PublicDisasterRecord["status"]
  severity?: PublicDisasterRecord["severity"]
}

/**
 * List disasters visible to the public. No auth required; used by
 * `/disasters` and the home page disaster section. Disabled while
 * `status`/`severity` are undefined (default behavior — list everything).
 */
export function usePublicDisasters(options: UsePublicDisastersOptions = {}) {
  return useQuery({
    queryKey: ["public", "disasters", options],
    queryFn: async () => {
      const response = await getShurokkhaApi().public.disasters.list({
        status: options.status ?? undefined,
        severity: options.severity ?? undefined,
      })
      return response
    },
  })
}
