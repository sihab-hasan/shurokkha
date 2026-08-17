import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type CollectionFooterProps = React.ComponentProps<"div"> & {
  summary?: React.ReactNode
  pagination?: React.ReactNode
  actions?: React.ReactNode
}

export function CollectionFooter({
  summary,
  pagination,
  actions,
  className,
  ...props
}: CollectionFooterProps) {
  return (
    <div
      data-ui-pattern="collection-footer"
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        className
      )}
      {...props}
    >
      {summary ? (
        <div className="text-xs text-muted-foreground">{summary}</div>
      ) : null}
      {pagination || actions ? (
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          {pagination}
          {actions}
        </div>
      ) : null}
    </div>
  )
}
