import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type MessageThreadProps = React.ComponentProps<"div"> & {
  header?: React.ReactNode
  children?: React.ReactNode
  composer?: React.ReactNode
  empty?: React.ReactNode
  isEmpty?: boolean
}

export function MessageThread({
  header,
  children,
  composer,
  empty,
  isEmpty = false,
  className,
  ...props
}: MessageThreadProps) {
  return (
    <div
      data-ui-pattern="message-thread"
      className={cn("flex h-full min-h-0 flex-col", className)}
      {...props}
    >
      {header ? <div className="shrink-0 border-b p-4">{header}</div> : null}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {isEmpty ? empty : children}
      </div>
      {composer ? (
        <div className="shrink-0 border-t bg-background p-3">{composer}</div>
      ) : null}
    </div>
  )
}
