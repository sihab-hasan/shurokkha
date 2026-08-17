import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type ConversationListProps = React.ComponentProps<"div"> & {
  header?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  empty?: React.ReactNode
  isEmpty?: boolean
}

export function ConversationList({
  header,
  children,
  footer,
  empty,
  isEmpty = false,
  className,
  ...props
}: ConversationListProps) {
  return (
    <div
      data-ui-pattern="conversation-list"
      className={cn("flex h-full min-h-0 flex-col", className)}
      {...props}
    >
      {header ? <div className="shrink-0 border-b p-4">{header}</div> : null}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isEmpty ? empty : children}
      </div>
      {footer ? <div className="shrink-0 border-t p-3">{footer}</div> : null}
    </div>
  )
}
