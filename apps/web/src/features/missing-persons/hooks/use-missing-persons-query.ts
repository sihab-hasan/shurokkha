"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type { MissingPersonStatus } from "@shurokkha/contracts"

import { titleCase } from "@/features/shared/formatters"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEARCH_DEBOUNCE_MS = 300
const DEFAULT_PER_PAGE = 10

export const MISSING_PERSON_SORT_FIELDS = [
  "created_at",
  "last_seen_at",
  "status",
] as const
export type MissingPersonSortField = (typeof MISSING_PERSON_SORT_FIELDS)[number]
export type MissingPersonSortDir = "asc" | "desc"

const DEFAULT_SORT: MissingPersonSortField = "created_at"
const DEFAULT_DIR: MissingPersonSortDir = "desc"

const STATUS_VALUES = [
  "reported",
  "under_review",
  "verified",
  "searching",
  "located",
  "closed",
  "rejected",
] as const satisfies readonly MissingPersonStatus[]

function isStatus(value: string): value is MissingPersonStatus {
  return (STATUS_VALUES as readonly string[]).includes(value)
}
function isSort(value: string): value is MissingPersonSortField {
  return (MISSING_PERSON_SORT_FIELDS as readonly string[]).includes(value)
}
function isDir(value: string): value is MissingPersonSortDir {
  return value === "asc" || value === "desc"
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface MissingPersonsFilters {
  search: string
  status: MissingPersonStatus | null
  sort: MissingPersonSortField
  dir: MissingPersonSortDir
  page: number
  per_page: number
}

export type ActiveFilterKey = "search" | "status" | "sort"

export interface ActiveFilter {
  key: ActiveFilterKey
  label: string
  displayValue: string
}

export interface UseMissingPersonsQuery extends MissingPersonsFilters {
  searchDraft: string
  setSearchDraft: (value: string) => void

  setStatus: (value: MissingPersonStatus | null) => void
  setSort: (field: MissingPersonSortField | null) => void
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
 * URL-backed filter state for the missing-persons page.
 *
 * - Search input is debounced 300 ms (or commits immediately on Enter).
 * - `status` accepts a single value (single-select).
 * - `sort` / `dir` are URL-backed; defaults omitted.
 *
 * MUST be rendered inside a <Suspense> boundary (reads `useSearchParams`).
 */
export function useMissingPersonsQuery(): UseMissingPersonsQuery {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // --- Read committed state from URL ---------------------------------------
  const search = clampSearch(searchParams.get("search"))
  const rawStatus = searchParams.get("status") ?? ""
  const status: MissingPersonStatus | null = isStatus(rawStatus)
    ? rawStatus
    : null
  const rawSort = searchParams.get("sort") ?? ""
  const rawDir = searchParams.get("dir") ?? ""
  const sort: MissingPersonSortField = isSort(rawSort) ? rawSort : DEFAULT_SORT
  const dir: MissingPersonSortDir = isDir(rawDir) ? rawDir : DEFAULT_DIR
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
    const timer = setTimeout(
      () => pushParams({ search: trimmed }),
      SEARCH_DEBOUNCE_MS
    )
    return () => clearTimeout(timer)
  }, [pushParams, search, searchDraft])

  const setSearchDraft = useCallback((value: string) => {
    setSearchDraftState(value.slice(0, 100))
  }, [])
  const commitSearch = useCallback(() => {
    commitSearchNow()
  }, [commitSearchNow])

  const setStatus = useCallback(
    (value: MissingPersonStatus | null) => {
      pushParams({ status: value ?? "" })
    },
    [pushParams]
  )

  const setSort = useCallback(
    (field: MissingPersonSortField | null) => {
      if (!field) {
        pushParams({ sort: "", dir: "" })
        return
      }
      if (field === sort) {
        pushParams({ dir: dir === "asc" ? "desc" : "asc" })
      } else {
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
    if (sort !== DEFAULT_SORT || dir !== DEFAULT_DIR) {
      out.push({
        key: "sort",
        label: "Sort",
        displayValue: `${titleCase(sort)} ${dir === "asc" ? "↑" : "↓"}`,
      })
    }
    return out
  }, [search, status, sort, dir])

  const hasActiveFilters = activeFilters.length > 0

  return {
    search,
    searchDraft,
    setSearchDraft,
    status,
    sort,
    dir,
    page,
    per_page: DEFAULT_PER_PAGE,
    setStatus,
    setSort,
    setPage,
    commitSearch,
    reset,
    removeFilter,
    hasActiveFilters,
    activeFilters,
  }
}
