"use client"

import Link from "next/link"
import { ArrowUpRight, CheckCircle2, Clock } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"

import { formatDateTime } from "@/features/shared/formatters"
import { useDonationsList } from "@/features/donations/hooks/use-donations-list"
import { routes } from "@/config/routes"

/**
 * Renders the most recent donation entry inside the dashboard activity
 * timeline. Reads from `/v1/donations` (paginated, page 1, newest
 * first) — TanStack Query shares this cache with the dedicated
 * donations list page so this is effectively free when the user has
 * visited `/account/donations`.
 *
 * Renders nothing while loading or when the user has zero donations —
 * the surrounding static entries still tell a complete story.
 */
export function RecentDonationActivityItem() {
  const { data, isPending } = useDonationsList({
    page: 1,
    per_page: 1,
    sort: "created_at",
    dir: "desc",
  })

  if (isPending) return null

  const donation = data?.data?.[0]
  if (!donation) return null

  const isCompleted = donation.status === "completed"

  const description = `Receipt ${
    donation.receipt_number ?? `#${donation.donation_id}`
  } • ৳${donation.amount.toLocaleString()} ${donation.currency}`

  const targetId = donation.receipt_number ?? String(donation.donation_id)

  return (
    <div className="group relative">
      <span className="absolute top-1 -left-[21px] flex size-3 rounded-full bg-primary ring-4 ring-background" />
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            {isCompleted
              ? "Donation Contribution Confirmed"
              : "Donation Contribution Submitted"}
            {isCompleted ? (
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Clock className="size-4 text-amber-600 dark:text-amber-400" />
            )}
          </h4>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs whitespace-nowrap text-muted-foreground">
            {formatDateTime(donation.created_at)}
          </span>
          <Button
            size="icon-xs"
            variant="ghost"
            render={<Link href={routes.account.donation(targetId)} />}
            aria-label="View donation receipt"
          >
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
