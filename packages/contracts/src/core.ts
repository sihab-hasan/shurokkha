export type EntityId = string

export interface ApiErrorContract {
  code?: string
  message: string
  errors?: Record<string, string[]>
}

export interface ApiResource<T> {
  data: T
}

export interface PaginationLinkSet {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface PaginatedResource<T> {
  data: T[]
  links: PaginationLinkSet
  meta: PaginationMeta
}

/**
 * Per-dimension facet counts returned alongside paginated list responses.
 *
 * Each dimension is a `{ [value]: count }` map keyed by enum value (e.g.
 * status, type, priority). Missing enum values are zero-filled server-side
 * so the UI never has to special-case "no rows".
 */
export interface FacetCounts {
  status?: Record<string, number>
  type?: Record<string, number>
  priority?: Record<string, number>
}

/**
 * A paginated list response that ALSO carries facet metadata. Mirrors
 * Laravel's `ResourceCollection::additional(['facets' => …])` shape.
 */
export interface PaginatedResourceWithFacets<T> extends PaginatedResource<T> {
  facets?: FacetCounts
}

/**
 * Response shape for bulk-action endpoints (bulk-cancel, bulk-close).
 *
 * `cancelled` / `closed` — ids that were successfully transitioned.
 * `skipped`             — ids the caller owns but that were already in a
 *                          terminal state and were left alone.
 * `missing`             — ids that don't exist OR are owned by a different
 *                          user; both are reported identically to avoid
 *                          leaking ownership info.
 */
export interface BulkActionResult {
  cancelled?: string[]
  closed?: string[]
  skipped: string[]
  missing: string[]
}
