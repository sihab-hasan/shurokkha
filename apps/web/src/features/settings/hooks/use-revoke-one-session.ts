"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ApiResource, RevokeOneSessionResponse } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { sessionsQueryKey } from "./use-sessions"

interface RevokeOneSessionVariables {
  sessionId: string
}

/**
 * Revoke a single session (a "Sign out this device" action). After
 * success the cached sessions list is refetched so the row disappears
 * without a hard reload. The current-session query is left intact —
 * revoking yourself is blocked server-side (422) and the UI never
 * exposes the button for the current row.
 */
export function useRevokeOneSession() {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResource<RevokeOneSessionResponse>,
    Error,
    RevokeOneSessionVariables
  >({
    mutationFn: async ({ sessionId }) => {
      const response = await getShurokkhaApi().settings.sessions.revokeOne(
        sessionId
      )
      return response
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...sessionsQueryKey] })
    },
  })
}
