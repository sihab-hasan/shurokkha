"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type {
  AssistanceRequestPriority,
  AssistanceRequestStatus,
  AssistanceRequestType,
} from "@shurokkha/contracts"

import { titleCase } from "@/features/shared/formatters"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEARCH_DEBOUNCE_MS = 300
const DEFAULT_PER_PAGE = 10

export const ASSISTANCE_SORT_FIELDS = [
  "created_at",
  "submitted_at",
  "priority",
  "status",
  "type",
  "affected_people_count",
] as const
export type AssistanceSortField = (typeof ASSISTANCE_SORT_FIELDS)[number]
export type AssistanceSortDir = "asc" | "desc"

const DEFAULT_SORT: AssistanceSortField = "created_at"
const DEFAULT_DIR: AssistanceSortDir = "desc"

const STATUS_VALUES = [
  "submitted",
  "verified",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
  "cancelled",
] as const satisfies readonly AssistanceRequestStatus[]

const TYPE_VALUES = [
  "rescue",
  "medical",
  "essentials",
  "shelter",
  "other",
] as const satisfies readonly AssistanceRequestType[]

const PRIORITY_VALUES = [
  "critical",
  "high",
  "normal",
] as const satisfies readonly AssistanceRequestPriority[]

function isStatus(value: string): value is AssistanceRequestStatus {
  return (STATUS_VALUES as readonly string[]).includes(value)
}
function isType(value: string): value is AssistanceRequestType {
  return (TYPE_VALUES as readonly string[]).includes(value)
}
function isPriority(value: string): value is AssistanceRequestPriority {
  return (PRIORITY_VALUES as readonly string[]).includes(value)
}
function isSort(value: string): value is AssistanceSortField {
  return (ASSISTANCE_SORT_FIELDS as readonly string[]).includes(value)
}
function isDir(value: string): value is AssistanceSortDir {
  return value === "asc" || value === "desc"
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type AssistanceFilters = {
  search: string
  status: AssistanceRequestStatus | null
  type: AssistanceRequestType | null
  priority: AssistanceRequestPriority | null
  sort: AssistanceSortField
  dir: AssistanceSortDir
  page: number
  per_page: number
}

export type ActiveFilterKey = "search" | "status" | "type" | "priority" | "sort"

export interface ActiveFilter {
  key: ActiveFilterKey
  label: string
  displayValue: string
}

export interface UseAssistanceQuery extends AssistanceFilters {
  searchDraft: string
  setSearchDraft: (value: string) => void

  /** Set the single status filter (or `null` to clear). */
  setStatus: (value: AssistanceRequestStatus | null) => void
  /** Set the single type filter (or `null` to clear). */
  setType: (value: AssistanceRequestType | null) => void
  /** Set the single priority filter (or `null` to clear). */
  setPriority: (value: AssistanceRequestPriority | null) => void
  /** Set sort field; toggles direction if same field. Pass null to clear. */
  setSort: (field: AssistanceSortField | null) => void
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
 * URL-backed filter state for the assistance page. URL is the source of truth.
 *
 * Single-value filters: `status`/`type`/`priority` accept one value or are
 * omitted. Search is debounced 300 ms (or commits on Enter). Other setters
 * reset page to 1. Defaults are omitted from the URL.
 *
 * MUST be rendered inside a <Suspense> boundary (reads `useSearchParams`).
 */
export function useAssistanceQuery(): UseAssistanceQuery {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // --- Read committed state from URL ---------------------------------------
  const search = clampSearch(searchParams.get("search"))

  const rawStatus = searchParams.get("status") ?? ""
  const status: AssistanceRequestStatus | null = isStatus(rawStatus)
    ? rawStatus
    : null

  const rawType = searchParams.get("type") ?? ""
  const type: AssistanceRequestType | null = isType(rawType) ? rawType : null

  const rawPriority = searchParams.get("priority") ?? ""
  const priority: AssistanceRequestPriority | null = isPriority(rawPriority)
    ? rawPriority
    : null

  const rawSort = searchParams.get("sort") ?? ""
  const rawDir = searchParams.get("dir") ?? ""
  const sort: AssistanceSortField = isSort(rawSort) ? rawSort : DEFAULT_SORT
  const dir: AssistanceSortDir = isDir(rawDir) ? rawDir : DEFAULT_DIR

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
        priority: string
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
    (value: AssistanceRequestStatus | null) => {
      pushParams({ status: value ?? "" })
    },
    [pushParams]
  )
  const setType = useCallback(
    (value: AssistanceRequestType | null) => {
      pushParams({ type: value ?? "" })
    },
    [pushParams]
  )
  const setPriority = useCallback(
    (value: AssistanceRequestPriority | null) => {
      pushParams({ priority: value ?? "" })
    },
    [pushParams]
  )

  const setSort = useCallback(
    (field: AssistanceSortField | null) => {
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
        case "priority":
          pushParams({ priority: "" })
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
    if (priority) {
      out.push({
        key: "priority",
        label: "Priority",
        displayValue: titleCase(priority),
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
  }, [search, status, type, priority, sort, dir])

  const hasActiveFilters = activeFilters.length > 0

  return {
    search,
    searchDraft,
    setSearchDraft,
    status,
    type,
    priority,
    sort,
    dir,
    page,
    per_page: DEFAULT_PER_PAGE,
    setStatus,
    setType,
    setPriority,
    setSort,
    setPage,
    commitSearch,
    reset,
    removeFilter,
    hasActiveFilters,
    activeFilters,
  }
}
