"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import type {
  MissingPersonListParams,
  MissingPersonReportRecord,
  PaginatedResource,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

export interface MissingPersonListParamsInternal {
  search?: string
  status?: string
  page: number
  per_page: number
  sort?: "created_at" | "last_seen_at" | "status"
  dir?: "asc" | "desc"
}

/**
 * Shared, cached fetch for the missing-persons list. Multiple sections call
 * this hook with the same filter inputs and TanStack Query deduplicates the
 * request and shares the cache.
 */
export function useMissingPersonsList(
  params: MissingPersonListParamsInternal
): UseQueryResult<PaginatedResource<MissingPersonReportRecord>, Error> {
  const apiParams: MissingPersonListParams = {
    page: params.page,
    per_page: params.per_page,
    search: params.search,
    status: params.status,
    sort: params.sort,
    dir: params.dir,
  }

  return useQuery<PaginatedResource<MissingPersonReportRecord>, Error>({
    queryKey: ["missing-persons", "list", params],
    queryFn: () => getShurokkhaApi().resources.missingPersons.list(apiParams),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  })
}
