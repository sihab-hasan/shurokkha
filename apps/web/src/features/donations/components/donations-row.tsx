"use client"

import type { DonationRecord, DonationStatus } from "@shurokkha/contracts"
import { Badge } from "@shurokkha/ui/components/badge"
import { TableCell, TableRow } from "@shurokkha/ui/components/table"

import { formatDateTime, titleCase } from "@/features/shared/formatters"

const STATUS_TONE: Record<
  DonationStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  pending: "warning",
  processing: "info",
  completed: "success",
  failed: "destructive",
  refunded: "secondary",
}

/**
 * Renders a row inside the donations table. Column visibility is
 * controlled by the parent: hidden cells are rendered with `hidden` so
 * the rest of the table reflows.
 *
 * The row body is the click target — wired by the parent to navigate
 * to `/account/donations/{receipt}`, which the `@modal` parallel slot
 * intercepts and renders as a centered <Dialog> with the receipt.
 *
 * Columns:
 *  - receipt    Receipt number (mono, e.g. "DON-000481")
 *  - campaign   Campaign title (or donation_kind fallback)
 *  - amount     Amount in BDT, right-aligned, font-medium
 *  - method     Payment method (title-case)
 *  - status     Status badge
 *  - submitted  Created timestamp
 */
export interface DonationsRowProps {
  item: DonationRecord
  hiddenColumns: Set<string>
  /** Row click handler — opens the modal detail view. */
  onClick?: () => void
}

export function DonationsRow({
  item,
  hiddenColumns,
  onClick,
}: DonationsRowProps) {
  const isHidden = (key: string) => hiddenColumns.has(key)
  const cellClass = (key: string) => (isHidden(key) ? "hidden" : "")

  const statusKey = (item.status as DonationStatus) ?? "pending"
  const statusVariant = STATUS_TONE[statusKey] ?? "secondary"

  const campaignTitle =
    item.campaign_title && item.campaign_title.trim().length > 0
      ? item.campaign_title
      : titleCase(item.donation_kind)

  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell
        className={`${cellClass("receipt")} font-mono text-xs text-muted-foreground`}
      >
        {item.receipt_number ?? `#${item.donation_id}`}
      </TableCell>
      <TableCell className={cellClass("campaign")}>
        <div className="block max-w-md">
          <div className="font-medium">{campaignTitle}</div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {titleCase(item.donation_kind)}
          </p>
        </div>
      </TableCell>
      <TableCell
        className={`text-right font-medium tabular-nums ${cellClass("amount")}`}
      >
        ৳{item.amount.toLocaleString()}
      </TableCell>
      <TableCell className={cellClass("method")}>
        <span className="text-xs text-muted-foreground">
          {item.payment_method ? titleCase(item.payment_method) : "—"}
        </span>
      </TableCell>
      <TableCell className={cellClass("status")}>
        <Badge variant={statusVariant}>{titleCase(item.status)}</Badge>
      </TableCell>
      <TableCell
        className={`text-xs whitespace-nowrap text-muted-foreground ${cellClass("submitted")}`}
      >
        {formatDateTime(item.created_at)}
      </TableCell>
    </TableRow>
  )
}
