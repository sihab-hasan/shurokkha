"use client"

import { useCallback } from "react"

import { useRouter } from "next/navigation"

import { Loader2 } from "lucide-react"

import type { MissingPersonReportRecord } from "@shurokkha/contracts"
import { Button } from "@shurokkha/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@shurokkha/ui/components/empty"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import { ApiFailure } from "@/features/shared/api-feedback"
import { formatDateTime, titleCase } from "@/features/shared/formatters"
import { routes } from "@/config/routes"
import { useListVirtualizer } from "@/lib/use-virtualizer"

import { useMissingPersonsList } from "../hooks/use-missing-persons-list"
import { useMissingPersonsQuery } from "../hooks/use-missing-persons-query"

import { MissingPersonOnboarding } from "./missing-person-onboarding"

const SKELETON_ROW_COUNT = 10
const ROW_HEIGHT = 88
const VIRTUALIZE_THRESHOLD = 50

function statusTone(status: MissingPersonReportRecord["status"]) {
  if (status === "located") return "success" as const
  if (status === "closed" || status === "rejected") return "danger" as const
  if (status === "verified" || status === "searching") return "info" as const
  return "warning" as const
}

interface RowProps {
  item: MissingPersonReportRecord
  onOpen: () => void
}

/**
 * Single missing-person card row. Hoisted out of the list so the virtual
 * renderer can re-use the exact same JSX without duplication.
 */
function MissingPersonRow({ item, onOpen }: RowProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-stretch gap-3 border-b px-5 py-4 text-left transition-colors hover:bg-muted/40"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="font-medium">{item.full_name}</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Last seen: {item.last_seen_location}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {formatDateTime(item.last_seen_at)}
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium ${
              statusTone(item.status) === "success"
                ? "bg-success/10 text-success"
                : statusTone(item.status) === "danger"
                  ? "bg-danger/10 text-danger"
                  : statusTone(item.status) === "info"
                    ? "bg-info/10 text-info"
                    : "bg-warning/10 text-warning"
            }`}
          >
            {titleCase(item.status)}
          </span>
        </div>
      </div>
    </button>
  )
}

/**
 * Card list of missing-persons reports for the current filter set.
 *
 * - Reads filters from {@link useMissingPersonsQuery}.
 * - Reads the page data from {@link useMissingPersonsList}, which uses
 *   `placeholderData: keepPreviousData` so pagination does not flash
 *   a skeleton — previous rows stay visible (dimmed) while the next
 *   page loads.
 * - For first-time users (no reports filed yet, no filters active),
 *   renders the {@link MissingPersonOnboarding} panel instead of a
 *   cold empty state.
 * - Row clicks navigate to `/account/missing-persons/{id}`, which the
 *   `@modal` parallel slot intercepts to render a centered <Dialog>
 *   with the report detail.
 * - When the page contains more than 50 rows, switches to a virtualized
 *   scroll container ({@link useListVirtualizer}) so even huge lists
 *   stay buttery.
 *
 * No bulk-action / multi-row selection — those flows rarely earn their
 * UI weight on user-facing lists; admins can run them server-side.
 */
export function MissingPersonList() {
  const { search, status, sort, dir, page, per_page, reset } =
    useMissingPersonsQuery()

  const { data, isPending, isFetching, isPlaceholderData, error, refetch } =
    useMissingPersonsList({
      search: search || undefined,
      status: status ?? undefined,
      sort,
      dir,
      page,
      per_page,
    })

  const router = useRouter()

  const records = data?.data ?? []
  const hasResults = records.length > 0

  const handleOpen = useCallback(
    (id: string) => {
      // Navigates to `/account/missing-persons/{id}` — the @modal slot
      // intercepts this when the user is already on
      // `/account/missing-persons` and renders a centered <Dialog> with
      // the report detail.
      router.push(routes.account.missingPerson(id))
    },
    [router]
  )

  if (isPending) {
    return <MissingPersonListSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-xl border bg-card p-5">
        <ApiFailure error={error} fallback="We couldn't load your reports." />
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

  if (!hasResults) {
    const filtered = Boolean(search) || Boolean(status)

    const isFirstTimeUser = !filtered && (data?.meta.total ?? 0) === 0

    if (isFirstTimeUser) {
      return <MissingPersonOnboarding />
    }

    return (
      <div className="rounded-xl border bg-card">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No matching reports</EmptyTitle>
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
        className={`relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-opacity ${
          isPlaceholderData ? "opacity-60" : ""
        }`}
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

        <MissingPersonListBody records={records} onOpen={handleOpen} />
      </div>
    </div>
  )
}

interface ListBodyProps {
  records: MissingPersonReportRecord[]
  onOpen: (id: string) => void
}

/**
 * Switches between the simple flat list (<50 rows) and the virtualized
 * scroll container (≥50 rows). Encapsulating the threshold here keeps
 * the parent component from having to know about virtualization at all.
 */
function MissingPersonListBody({ records, onOpen }: ListBodyProps) {
  const { parentRef, virtualizer, shouldVirtualize } = useListVirtualizer(
    records.length,
    { estimateSize: ROW_HEIGHT }
  )

  if (!shouldVirtualize) {
    return (
      <div>
        {records.map((item) => (
          <MissingPersonRow
            key={item.id}
            item={item}
            onOpen={() => onOpen(item.id)}
          />
        ))}
      </div>
    )
  }

  const items = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  return (
    <div
      ref={parentRef}
      className="max-h-[70vh] overflow-y-auto"
      role="rowgroup"
    >
      <div style={{ height: `${totalSize}px`, position: "relative" }}>
        {items.map((virtualItem) => {
          const item = records[virtualItem.index]
          if (!item) return null
          return (
            <div
              key={item.id}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <MissingPersonRow item={item} onOpen={() => onOpen(item.id)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MissingPersonListSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <ul className="divide-y">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
          <li key={i} className="p-5">
            <Skeleton className="h-12 w-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}
