"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type {
  DonationKind,
  DonationPaymentMethod,
  DonationStatus,
} from "@shurokkha/contracts"

import { titleCase } from "@/features/shared/formatters"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEARCH_DEBOUNCE_MS = 300
const DEFAULT_PER_PAGE = 10

export const DONATIONS_SORT_FIELDS = [
  "created_at",
  "amount",
  "campaign_title",
] as const
export type DonationSortField = (typeof DONATIONS_SORT_FIELDS)[number]
export type DonationSortDir = "asc" | "desc"

const DEFAULT_SORT: DonationSortField = "created_at"
const DEFAULT_DIR: DonationSortDir = "desc"

const STATUS_VALUES = [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
] as const satisfies readonly DonationStatus[]

const TYPE_VALUES = [
  "one_time",
  "recurring",
  "zakat",
  "sadaqah",
  "general",
] as const satisfies readonly DonationKind[]

const METHOD_VALUES = [
  "bkash",
  "nagad",
  "rocket",
  "bank",
  "card",
] as const satisfies readonly DonationPaymentMethod[]

function isStatus(value: string): value is DonationStatus {
  return (STATUS_VALUES as readonly string[]).includes(value)
}
function isType(value: string): value is DonationKind {
  return (TYPE_VALUES as readonly string[]).includes(value)
}
function isMethod(value: string): value is DonationPaymentMethod {
  return (METHOD_VALUES as readonly string[]).includes(value)
}
function isSort(value: string): value is DonationSortField {
  return (DONATIONS_SORT_FIELDS as readonly string[]).includes(value)
}
function isDir(value: string): value is DonationSortDir {
  return value === "asc" || value === "desc"
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type DonationFilters = {
  search: string
  status: DonationStatus | null
  type: DonationKind | null
  payment_method: DonationPaymentMethod | null
  sort: DonationSortField
  dir: DonationSortDir
  page: number
  per_page: number
}

export type ActiveFilterKey =
  "search" | "status" | "type" | "payment_method" | "sort"

export interface ActiveFilter {
  key: ActiveFilterKey
  label: string
  displayValue: string
}

export interface UseDonationsQuery extends DonationFilters {
  searchDraft: string
  setSearchDraft: (value: string) => void

  /** Set the single status filter (or `null` to clear). */
  setStatus: (value: DonationStatus | null) => void
  /** Set the single type filter (or `null` to clear). */
  setType: (value: DonationKind | null) => void
  /** Set the single payment-method filter (or `null` to clear). */
  setPaymentMethod: (value: DonationPaymentMethod | null) => void
  /** Set sort field; toggles direction if same field. Pass null to clear. */
  setSort: (field: DonationSortField | null) => void
  setPage: (value: number) => void
  commitSearch: () => void

  reset: () => void
  removeFilter: (key: ActiveFilterKey) => void

  hasActiveFilters: boolean
  activeFilters: ActiveFilter[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clampSearch(raw: string | null): string {
  if (!raw) return ""
  return raw.slice(0, 100)
}
function clampPage(raw: string | null): number {
  if (!raw) return 1
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1) return 1
  return n
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * URL-backed filter state for the donations page. URL is the source of truth.
 *
 * Single-value filters: `status`/`type`/`payment_method` accept one value or
 * are omitted. Search is debounced 300 ms (or commits on Enter). Other
 * setters reset page to 1. Defaults are omitted from the URL.
 *
 * MUST be rendered inside a <Suspense> boundary (reads `useSearchParams`).
 */
export function useDonationsQuery(): UseDonationsQuery {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // --- Read committed state from URL ---------------------------------------
  const search = clampSearch(searchParams.get("search"))

  const rawStatus = searchParams.get("status") ?? ""
  const status: DonationStatus | null = isStatus(rawStatus) ? rawStatus : null

  const rawType = searchParams.get("type") ?? ""
  const type: DonationKind | null = isType(rawType) ? rawType : null

  const rawMethod = searchParams.get("payment_method") ?? ""
  const payment_method: DonationPaymentMethod | null = isMethod(rawMethod)
    ? rawMethod
    : null

  const rawSort = searchParams.get("sort") ?? ""
  const rawDir = searchParams.get("dir") ?? ""
  const sort: DonationSortField = isSort(rawSort) ? rawSort : DEFAULT_SORT
  const dir: DonationSortDir = isDir(rawDir) ? rawDir : DEFAULT_DIR

  const page = clampPage(searchParams.get("page"))

  // --- Local draft state for the search input ------------------------------
  const [searchDraft, setSearchDraftState] = useState<string>(search)

  useEffect(() => {
    setSearchDraftState(search)
  }, [search])

  // --- URL mutation helper --------------------------------------------------
  const pushParams = useCallback(
    (
      patch: Partial<{
        search: string
        status: string
        type: string
        payment_method: string
        sort: string
        dir: string
        page: number
      }>
    ) => {
      const next = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(patch)) {
        if (key === "page") {
          if (value === 1 || value === undefined) next.delete("page")
          else next.set("page", String(value))
          continue
        }
        if (value === undefined || value === "") next.delete(key)
        else next.set(key, String(value))
      }

      // Any non-page change forces page back to 1.
      const touchedNonPage = Object.keys(patch).some((k) => k !== "page")
      if (touchedNonPage) next.delete("page")

      const qs = next.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  // --- Debounced search commit --------------------------------------------
  const commitSearchNow = useCallback(() => {
    const next = searchDraft.trim()
    if (next === search) return
    pushParams({ search: next })
  }, [pushParams, search, searchDraft])

  useEffect(() => {
    const trimmed = searchDraft.trim()
    if (trimmed === search) return
    const timer = setTimeout(() => {
      pushParams({ search: trimmed })
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [pushParams, search, searchDraft])

  const setSearchDraft = useCallback((value: string) => {
    setSearchDraftState(value.slice(0, 100))
  }, [])
  const commitSearch = useCallback(() => {
    commitSearchNow()
  }, [commitSearchNow])

  // --- Single-select helpers ----------------------------------------------
  const setStatus = useCallback(
    (value: DonationStatus | null) => {
      pushParams({ status: value ?? "" })
    },
    [pushParams]
  )
  const setType = useCallback(
    (value: DonationKind | null) => {
      pushParams({ type: value ?? "" })
    },
    [pushParams]
  )
  const setPaymentMethod = useCallback(
    (value: DonationPaymentMethod | null) => {
      pushParams({ payment_method: value ?? "" })
    },
    [pushParams]
  )

  const setSort = useCallback(
    (field: DonationSortField | null) => {
      if (!field) {
        pushParams({ sort: "", dir: "" })
        return
      }
      if (field === sort) {
        // Same field → toggle direction.
        pushParams({ dir: dir === "asc" ? "desc" : "asc" })
      } else {
        // New field → use default dir for predictable behavior.
        pushParams({ sort: field, dir: DEFAULT_DIR })
      }
    },
    [sort, dir, pushParams]
  )

  const setPage = useCallback(
    (value: number) => pushParams({ page: Math.max(1, value) }),
    [pushParams]
  )

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false })
    setSearchDraftState("")
  }, [pathname, router])

  const removeFilter = useCallback(
    (key: ActiveFilterKey) => {
      switch (key) {
        case "search":
          pushParams({ search: "" })
          setSearchDraftState("")
          break
        case "status":
          pushParams({ status: "" })
          break
        case "type":
          pushParams({ type: "" })
          break
        case "payment_method":
          pushParams({ payment_method: "" })
          break
        case "sort":
          pushParams({ sort: "", dir: "" })
          break
      }
    },
    [pushParams]
  )

  // --- Derived: active filter chips ----------------------------------------
  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const out: ActiveFilter[] = []
    if (search) {
      out.push({
        key: "search",
        label: "Search",
        displayValue: `“${search}”`,
      })
    }
    if (status) {
      out.push({
        key: "status",
        label: "Status",
        displayValue: titleCase(status),
      })
    }
    if (type) {
      out.push({
        key: "type",
        label: "Type",
        displayValue: titleCase(type),
      })
    }
    if (payment_method) {
      out.push({
        key: "payment_method",
        label: "Method",
        displayValue: titleCase(payment_method),
      })
    }
    if (sort !== DEFAULT_SORT || dir !== DEFAULT_DIR) {
      out.push({
        key: "sort",
        label: "Sort",
        displayValue: `${titleCase(sort)} ${dir === "asc" ? "↑" : "↓"}`,
      })
    }
    return out
  }, [search, status, type, payment_method, sort, dir])

  const hasActiveFilters = activeFilters.length > 0

  return {
    search,
    searchDraft,
    setSearchDraft,
    status,
    type,
    payment_method,
    sort,
    dir,
    page,
    per_page: DEFAULT_PER_PAGE,
    setStatus,
    setType,
    setPaymentMethod,
    setSort,
    setPage,
    commitSearch,
    reset,
    removeFilter,
    hasActiveFilters,
    activeFilters,
  }
}
