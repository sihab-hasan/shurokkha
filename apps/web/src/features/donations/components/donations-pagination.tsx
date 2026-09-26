"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@shurokkha/ui/components/pagination"

import { useDonationsList } from "../hooks/use-donations-list"
import { useDonationsQuery } from "../hooks/use-donations-query"

/**
 * Bottom-of-list pagination strip for the donations page.
 *
 * - Reads page + per_page from {@link useDonationsQuery}.
 * - Reads the page data from {@link useDonationsList} — TanStack
 *   Query shares the cache with {@link DonationsList} so this costs
 *   nothing.
 * - Returns nothing while the list is loading or has no data.
 */
export function DonationsPagination() {
  const {
    search,
    status,
    type,
    payment_method,
    sort,
    dir,
    page,
    per_page,
    setPage,
  } = useDonationsQuery()

  const { data, isFetching } = useDonationsList({
    search: search || undefined,
    status: status ?? undefined,
    type: type ?? undefined,
    payment_method: payment_method ?? undefined,
    sort,
    dir,
    page,
    per_page,
  })

  const meta = data?.meta
  if (!meta) return null

  const canPrev = meta.current_page > 1
  const canNext = meta.current_page < meta.last_page
  const window = buildPageWindow(meta.current_page, meta.last_page)
  const summary = buildSummary(meta)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{summary}</span>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault()
                if (!canPrev || isFetching) return
                setPage(Math.max(1, meta.current_page - 1))
              }}
              aria-disabled={!canPrev || isFetching}
              className={
                !canPrev || isFetching
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>

          {window.map((entry, index) =>
            entry === "…" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={entry}>
                <PaginationLink
                  href="#"
                  isActive={entry === meta.current_page}
                  onClick={(event) => {
                    event.preventDefault()
                    if (isFetching) return
                    setPage(entry)
                  }}
                >
                  {entry}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault()
                if (!canNext || isFetching) return
                setPage(meta.current_page + 1)
              }}
              aria-disabled={!canNext || isFetching}
              className={
                !canNext || isFetching
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function buildPageWindow(current: number, last: number): Array<number | "…"> {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)

  const window: Array<number | "…"> = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(last - 1, current + 1)

  if (left > 2) window.push("…")
  for (let page = left; page <= right; page++) window.push(page)
  if (right < last - 1) window.push("…")
  window.push(last)

  return window
}

function buildSummary(meta: {
  total: number
  from: number | null
  to: number | null
  per_page: number
  current_page: number
}): string {
  const total = meta.total
  const from =
    meta.from ?? (total === 0 ? 0 : (meta.current_page - 1) * meta.per_page + 1)
  const to = meta.to ?? Math.min(total, meta.current_page * meta.per_page)
  if (total === 0) return "No donations"
  return `Showing ${from.toLocaleString()}–${to.toLocaleString()} of ${total.toLocaleString()}`
}
