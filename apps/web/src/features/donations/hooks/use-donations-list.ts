"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import type {
  DonationListParams,
  DonationRecord,
  DonationSortDir,
  DonationSortField,
  PaginatedResource,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

/**
 * Single-value filters — backend accepts a single string for status/type/
 * payment_method (Laravel binds it as `whereIn` with one element).
 */
export interface DonationListHookParams {
  search?: string
  status?: string
  type?: string
  payment_method?: string
  page: number
  per_page: number
  sort?: DonationSortField
  dir?: DonationSortDir
}

/**
 * Shared, cached fetch for the donations list. Multiple sections (list,
 * pagination) call this hook with the same filter inputs and TanStack
 * Query deduplicates the request and shares the cache.
 *
 * `placeholderData: keepPreviousData` keeps the previous page rendered
 * during pagination so users never see a skeleton flash.
 */
export function useDonationsList(
  params: DonationListHookParams
): UseQueryResult<PaginatedResource<DonationRecord>, Error> {
  const apiParams: DonationListParams = {
    page: params.page,
    per_page: params.per_page,
    search: params.search,
    status: params.status,
    type: params.type,
    payment_method: params.payment_method,
    sort: params.sort,
    dir: params.dir,
  }

  return useQuery<PaginatedResource<DonationRecord>, Error>({
    queryKey: ["donations", "list", params],
    queryFn: () => getShurokkhaApi().resources.donations.list(apiParams),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  })
}
