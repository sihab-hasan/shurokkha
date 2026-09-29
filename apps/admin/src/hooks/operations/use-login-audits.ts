"use client"

import { useQuery } from "@tanstack/react-query"

import type { LoginAuditListParams } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { LoginAuditAdminRecord } from "./types"

export function useLoginAudits(params: LoginAuditListParams = {}) {
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.loginAudits.list(
      params as Record<string, unknown>
    ),
    queryFn: async () => {
      const res = await api.admin.loginAudits.list(params)
      return (res.data ?? []) as unknown as LoginAuditAdminRecord[]
    },
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
  }
}

export function useLoginAudit(auditId: number | undefined) {
  const { data, isLoading } = useLoginAudits()
  const audit =
    auditId == null ? undefined : data.find((row) => row.audit_id === auditId)
  return { audit, isLoading }
}
