"use client"

import { useQuery } from "@tanstack/react-query"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { EmergencyRequestAdminRecord } from "./types"

/**
 * Fetch the list of emergency requests used to populate the team-assignment
 * form request dropdown. Routes through the shared api-client so that
 * auth headers, base URL, and 401 handling stay consistent with every
 * other admin call.
 *
 * The api-client returns `AdminEmergencyRequestRecord[]`, which is
 * structurally identical to our local `EmergencyRequestAdminRecord`. We
 * cast to the local type so the rest of the app keeps a single source of
 * truth for row shape.
 */
export function useEmergencyRequests() {
  const api = getShurokkhaApi()
  return useQuery({
    queryKey: operationsQueryKeys.emergencyRequests.list(),
    queryFn: async () => {
      const res = await api.admin.emergencyRequests.list()
      return (res.data ?? []) as unknown as EmergencyRequestAdminRecord[]
    },
  })
}

/**
 * Convenience selector that returns the array directly (unwraps the query
 * result). Use this when the loading state isn't important.
 */
export function useEmergencyRequestsList(): EmergencyRequestAdminRecord[] {
  const query = useEmergencyRequests()
  return query.data ?? []
}
