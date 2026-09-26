"use client"

import type {
  AssistanceRequestPriority,
  AssistanceRequestRecord,
  AssistanceRequestStatus,
} from "@shurokkha/contracts"
import { Badge } from "@shurokkha/ui/components/badge"
import { TableCell, TableRow } from "@shurokkha/ui/components/table"

import { formatDateTime, titleCase } from "@/features/shared/formatters"

const STATUS_TONE: Record<
  AssistanceRequestStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  submitted: "warning",
  verified: "info",
  assigned: "info",
  in_progress: "info",
  resolved: "success",
  rejected: "danger",
  cancelled: "danger",
}

const PRIORITY_TONE: Record<
  AssistanceRequestPriority,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  critical: "destructive",
  high: "warning",
  normal: "secondary",
}

/**
 * Renders a row inside the assistance requests table. Column visibility is
 * controlled by the parent: hidden cells are rendered with `hidden` so the
 * rest of the table reflows.
 *
 * The row body is the click target — wired by the parent to navigate to
 * `/account/assistance/{id}`, which the `@modal` parallel slot intercepts
 * and renders as a centered <Dialog> with the request detail.
 *
 * Columns:
 *  - id         request id (mono)
 *  - request    type + description
 *  - address    address
 *  - priority   priority badge
 *  - status     status badge
 *  - submitted  submitted/created timestamp
 */
export interface AssistanceRowProps {
  item: AssistanceRequestRecord
  hiddenColumns: Set<string>
  /** Row click handler — opens the modal detail view. */
  onClick?: () => void
}

export function AssistanceRow({
  item,
  hiddenColumns,
  onClick,
}: AssistanceRowProps) {
  const isHidden = (key: string) => hiddenColumns.has(key)
  const cellClass = (key: string) => (isHidden(key) ? "hidden" : "")

  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell
        className={`${cellClass("id")} font-mono text-xs text-muted-foreground`}
      >
        {item.id}
      </TableCell>
      <TableCell className={cellClass("request")}>
        <div className="block max-w-md">
          <div className="font-medium">{titleCase(item.type)} assistance</div>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {item.description || "No description provided."}
          </p>
        </div>
      </TableCell>
      <TableCell
        className={`text-xs text-muted-foreground ${cellClass("address")}`}
      >
        {item.address || "—"}
      </TableCell>
      <TableCell className={cellClass("priority")}>
        <Badge variant={PRIORITY_TONE[item.priority]}>
          {titleCase(item.priority)}
        </Badge>
      </TableCell>
      <TableCell className={cellClass("status")}>
        <Badge variant={STATUS_TONE[item.status]}>
          {titleCase(item.status)}
        </Badge>
      </TableCell>
      <TableCell
        className={`text-xs whitespace-nowrap text-muted-foreground ${cellClass("submitted")}`}
      >
        {formatDateTime(item.submitted_at ?? item.created_at)}
      </TableCell>
    </TableRow>
  )
}
