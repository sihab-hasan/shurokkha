"use client"

import { useQuery } from "@tanstack/react-query"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { DisasterOption } from "./types"

/**
 * Fetch the list of disasters used to populate the affected-area form
 * disaster dropdown. The hook unwraps `useQuery` so consumers get an
 * `Array<DisasterOption>` directly, mirroring `useAffectedAreas` etc.
 */
export function useDisasters() {
  const api = getShurokkhaApi()
  const query = useQuery({
    queryKey: operationsQueryKeys.disasters.list(),
    queryFn: async () => {
      const res = await api.admin.disasters.list()
      return (res.data ?? []) as unknown as DisasterOption[]
    },
  })
  return query.data ?? []
}
