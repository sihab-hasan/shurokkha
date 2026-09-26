"use client"

import { useCallback, useMemo } from "react"

import { useRouter } from "next/navigation"

import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@shurokkha/ui/components/empty"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@shurokkha/ui/components/table"

import { ApiFailure } from "@/features/shared/api-feedback"
import { routes } from "@/config/routes"

import { useAssistanceList } from "../hooks/use-assistance-list"
import { useAssistanceQuery } from "../hooks/use-assistance-query"
import { useAssistanceStats } from "../hooks/use-assistance-stats"
import { useAssistanceTablePrefs } from "../hooks/use-table-prefs"

import { AssistanceOnboarding } from "./assistance-onboarding"
import { AssistanceRow } from "./assistance-row"

const SKELETON_ROW_COUNT = 10

/**
 * Table of assistance requests for the current filter set.
 *
 * - Density + visible columns come from {@link useAssistanceTablePrefs}.
 * - Sort field/dir are URL-backed via {@link useAssistanceQuery}.
 * - Row clicks navigate to `/account/assistance/{id}`, which the
 *   `@modal` parallel slot intercepts to render a centered <Dialog>
 *   with the request detail.
 *
 * No bulk-action / multi-row selection — those flows rarely earn their
 * UI weight on user-facing lists; admins can run them server-side.
 */
export function AssistanceList() {
  const {
    search,
    status,
    type,
    priority,
    sort,
    dir,
    setSort,
    page,
    per_page,
    reset,
  } = useAssistanceQuery()

  const { data, isPending, isFetching, isPlaceholderData, error, refetch } =
    useAssistanceList({
      search: search || undefined,
      status: status ?? undefined,
      type: type ?? undefined,
      priority: priority ?? undefined,
      sort,
      dir,
      page,
      per_page,
    })

  const { data: statsData } = useAssistanceStats()
  const { prefs } = useAssistanceTablePrefs()

  const hiddenColumns = useMemo(() => {
    const set = new Set<string>()
    for (const key of Object.keys(prefs.columns)) {
      if (prefs.columns[key as keyof typeof prefs.columns] === false) {
        set.add(key)
      }
    }
    return set
  }, [prefs.columns])

  const router = useRouter()

  const records = data?.data ?? []

  const handleOpenRow = useCallback(
    (id: string) => {
      // Navigates to `/account/assistance/{id}` — the @modal slot
      // intercepts this when the user is already on `/account/assistance`
      // and renders a centered <Dialog> with the request detail.
      router.push(routes.account.assistanceRequest(id))
    },
    [router]
  )

  if (isPending) {
    return <AssistanceListSkeleton density={prefs.density} />
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-xl border bg-card p-5">
        <ApiFailure error={error} fallback="We couldn't load your requests." />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </div>
    )
  }

  const hasResults = records.length > 0

  if (!hasResults) {
    const filtered =
      Boolean(search) || Boolean(status) || Boolean(type) || Boolean(priority)

    const isFirstTimeUser = !filtered && (statsData?.data.total ?? 0) === 0

    if (isFirstTimeUser) {
      return <AssistanceOnboarding />
    }

    return (
      <div className="rounded-xl border bg-card">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No matching requests</EmptyTitle>
            <EmptyDescription>
              Try removing a filter or two to widen the results.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" onClick={reset}>
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      <div
        data-density={prefs.density}
        className={`relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-opacity ${
          isPlaceholderData ? "opacity-60" : ""
        } data-[density=comfortable]:[&_td]:py-5 data-[density=compact]:[&_td]:py-1 data-[density=compact]:[&_td]:text-xs`}
      >
        {isFetching ? (
          <div
            className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur"
            aria-live="polite"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            Updating…
          </div>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                aria-sort="none"
                className={hiddenColumns.has("id") ? "hidden" : "w-32"}
              >
                ID
              </TableHead>
              <SortableHead
                label="Request"
                field="type"
                hidden={hiddenColumns.has("request")}
                currentSort={sort}
                currentDir={dir}
                onSort={setSort}
              />
              <TableHead
                className={hiddenColumns.has("address") ? "hidden" : ""}
              >
                Address
              </TableHead>
              <SortableHead
                label="Priority"
                field="priority"
                hidden={hiddenColumns.has("priority")}
                currentSort={sort}
                currentDir={dir}
                onSort={setSort}
              />
              <SortableHead
                label="Status"
                field="status"
                hidden={hiddenColumns.has("status")}
                currentSort={sort}
                currentDir={dir}
                onSort={setSort}
              />
              <SortableHead
                label="Submitted"
                field="created_at"
                hidden={hiddenColumns.has("submitted")}
                currentSort={sort}
                currentDir={dir}
                onSort={setSort}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((item) => (
              <AssistanceRow
                key={item.id}
                item={item}
                hiddenColumns={hiddenColumns}
                onClick={() => handleOpenRow(item.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

interface SortableHeadProps {
  label: string
  field: import("../hooks/use-assistance-query").AssistanceSortField
  hidden: boolean
  currentSort: import("../hooks/use-assistance-query").AssistanceSortField
  currentDir: import("../hooks/use-assistance-query").AssistanceSortDir
  onSort: (
    field: import("../hooks/use-assistance-query").AssistanceSortField
  ) => void
}

function SortableHead({
  label,
  field,
  hidden,
  currentSort,
  currentDir,
  onSort,
}: SortableHeadProps) {
  const active = currentSort === field
  const ariaSort = active
    ? currentDir === "asc"
      ? "ascending"
      : "descending"
    : "none"

  return (
    <TableHead aria-sort={ariaSort} className={hidden ? "hidden" : ""}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1.5 rounded text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {label}
        {active ? (
          currentDir === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        )}
      </button>
    </TableHead>
  )
}

function AssistanceListSkeleton({
  density,
}: {
  density: "compact" | "default" | "comfortable"
}) {
  return (
    <div
      data-density={density}
      className="rounded-xl border bg-card text-card-foreground shadow-sm data-[density=comfortable]:[&_td]:py-5 data-[density=compact]:[&_td]:py-1"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">ID</TableHead>
            <TableHead>Request</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="w-32">Priority</TableHead>
            <TableHead className="w-36">Status</TableHead>
            <TableHead className="w-44">Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
            <TableRow key={i}>
              <td colSpan={6} className="p-3">
                <Skeleton className="h-6 w-full" />
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
