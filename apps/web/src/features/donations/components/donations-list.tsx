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

import { useDonationsList } from "../hooks/use-donations-list"
import { useDonationsQuery } from "../hooks/use-donations-query"
import { useDonationsStats } from "../hooks/use-donations-stats"
import { useDonationsTablePrefs } from "../hooks/use-table-prefs"

import { DonationsOnboarding } from "./donations-onboarding"
import { DonationsRow } from "./donations-row"

import type { DonationSortField, DonationSortDir } from "@shurokkha/contracts"

const SKELETON_ROW_COUNT = 8

/**
 * Table of donations for the current filter set.
 *
 * - Density + visible columns come from {@link useDonationsTablePrefs}.
 * - Sort field/dir are URL-backed via {@link useDonationsQuery}.
 * - Row clicks navigate to `/account/donations/{receipt}`, which the
 *   `@modal` parallel slot intercepts to render a centered <Dialog>
 *   with the receipt detail.
 *
 * No bulk-action / multi-row selection — those flows rarely earn their
 * UI weight on user-facing lists; admins can run them server-side.
 */
export function DonationsList() {
  const {
    search,
    status,
    type,
    payment_method,
    sort,
    dir,
    setSort,
    page,
    per_page,
    reset,
  } = useDonationsQuery()

  const { data, isPending, isFetching, isPlaceholderData, error, refetch } =
    useDonationsList({
      search: search || undefined,
      status: status ?? undefined,
      type: type ?? undefined,
      payment_method: payment_method ?? undefined,
      sort,
      dir,
      page,
      per_page,
    })

  const { data: statsData } = useDonationsStats()
  const { prefs } = useDonationsTablePrefs()

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
    (receipt: string) => {
      // Navigates to `/account/donations/{receipt}` — the @modal slot
      // intercepts this when the user is already on `/account/donations`
      // and renders a centered <Dialog> with the receipt detail.
      router.push(routes.account.donation(receipt))
    },
    [router]
  )

  if (isPending) {
    return <DonationsListSkeleton density={prefs.density} />
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-xl border bg-card p-5">
        <ApiFailure error={error} fallback="We couldn't load your donations." />
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
      Boolean(search) ||
      Boolean(status) ||
      Boolean(type) ||
      Boolean(payment_method)

    const isFirstTimeUser = !filtered && (statsData?.data.total ?? 0) === 0

    if (isFirstTimeUser) {
      return <DonationsOnboarding />
    }

    return (
      <div className="rounded-xl border bg-card">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No matching donations</EmptyTitle>
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
                className={hiddenColumns.has("receipt") ? "hidden" : "w-32"}
              >
                Receipt
              </TableHead>
              <SortableHead
                label="Campaign"
                field="campaign_title"
                hidden={hiddenColumns.has("campaign")}
                currentSort={sort}
                currentDir={dir}
                onSort={setSort}
              />
              <SortableHead
                label="Amount"
                field="amount"
                hidden={hiddenColumns.has("amount")}
                currentSort={sort}
                currentDir={dir}
                onSort={setSort}
                alignRight
              />
              <TableHead
                className={hiddenColumns.has("method") ? "hidden" : ""}
              >
                Method
              </TableHead>
              <TableHead
                className={hiddenColumns.has("status") ? "hidden" : ""}
              >
                Status
              </TableHead>
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
              <DonationsRow
                key={item.donation_id}
                item={item}
                hiddenColumns={hiddenColumns}
                onClick={() =>
                  handleOpenRow(item.receipt_number ?? String(item.donation_id))
                }
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
  field: DonationSortField
  hidden: boolean
  currentSort: DonationSortField
  currentDir: DonationSortDir
  onSort: (field: DonationSortField) => void
  alignRight?: boolean
}

function SortableHead({
  label,
  field,
  hidden,
  currentSort,
  currentDir,
  onSort,
  alignRight,
}: SortableHeadProps) {
  const active = currentSort === field
  const ariaSort = active
    ? currentDir === "asc"
      ? "ascending"
      : "descending"
    : "none"

  return (
    <TableHead
      aria-sort={ariaSort}
      className={`${hidden ? "hidden" : ""} ${alignRight ? "text-right" : ""}`}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`inline-flex items-center gap-1.5 rounded text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
          alignRight ? "ml-auto" : ""
        }`}
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

function DonationsListSkeleton({
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
            <TableHead className="w-32">Receipt</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead className="w-32 text-right">Amount</TableHead>
            <TableHead className="w-28">Method</TableHead>
            <TableHead className="w-32">Status</TableHead>
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
