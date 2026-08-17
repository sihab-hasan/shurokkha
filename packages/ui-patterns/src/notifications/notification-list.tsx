import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type NotificationListProps = React.ComponentProps<"div"> & {
  header?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  empty?: React.ReactNode
  isEmpty?: boolean
}

export function NotificationList({
  header,
  children,
  footer,
  empty,
  isEmpty = false,
  className,
  ...props
}: NotificationListProps) {
  return (
    <div
      data-ui-pattern="notification-list"
      className={cn("overflow-hidden rounded-xl border bg-card", className)}
      {...props}
    >
      {header ? <div className="border-b p-4">{header}</div> : null}
      <div className="divide-y divide-border">{isEmpty ? empty : children}</div>
      {footer ? <div className="border-t p-3">{footer}</div> : null}
    </div>
  )
}
