"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import type {
  AssistanceRequestListParams,
  AssistanceRequestRecord,
  PaginatedResource,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

/**
 * Single-value filters — backend accepts a single string for status/type/
 * priority (Laravel will bind it as `whereIn` with one element).
 */
export interface AssistanceListParams {
  search?: string
  status?: string
  type?: string
  priority?: string
  page: number
  per_page: number
  sort?:
    | "created_at"
    | "submitted_at"
    | "priority"
    | "status"
    | "type"
    | "affected_people_count"
  dir?: "asc" | "desc"
}

/**
 * Shared, cached fetch for the assistance list. Multiple sections (list,
 * pagination) call this hook with the same filter inputs and TanStack
 * Query deduplicates the request and shares the cache.
 *
 * `placeholderData: keepPreviousData` keeps the previous page rendered
 * during pagination so users never see a skeleton flash.
 */
export function useAssistanceList(
  params: AssistanceListParams
): UseQueryResult<PaginatedResource<AssistanceRequestRecord>, Error> {
  const apiParams: AssistanceRequestListParams = {
    page: params.page,
    per_page: params.per_page,
    search: params.search,
    status: params.status,
    type: params.type,
    priority: params.priority,
    sort: params.sort,
    dir: params.dir,
  }

  return useQuery<PaginatedResource<AssistanceRequestRecord>, Error>({
    queryKey: ["assistance", "list", params],
    queryFn: () =>
      getShurokkhaApi().resources.assistanceRequests.list(apiParams),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  })
}
