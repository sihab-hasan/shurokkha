import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type ConversationLayoutProps = React.ComponentProps<"div"> & {
  conversations: React.ReactNode
  children: React.ReactNode
  detail?: React.ReactNode
  listWidth?: string
  detailWidth?: string
  minHeight?: string
}

export function ConversationLayout({
  conversations,
  children,
  detail,
  listWidth = "21rem",
  detailWidth = "18rem",
  minHeight = "38rem",
  className,
  style,
  ...props
}: ConversationLayoutProps) {
  return (
    <div
      data-ui-pattern="conversation-layout"
      className={cn(
        "grid min-w-0 overflow-hidden rounded-xl border bg-card lg:grid-cols-[var(--pattern-conversation-list)_minmax(0,1fr)]",
        detail &&
          "xl:grid-cols-[var(--pattern-conversation-list)_minmax(0,1fr)_var(--pattern-conversation-detail)]",
        className
      )}
      style={
        {
          "--pattern-conversation-list": listWidth,
          "--pattern-conversation-detail": detailWidth,
          minHeight,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <aside className="min-w-0 border-b lg:border-r lg:border-b-0">
        {conversations}
      </aside>
      <section className="min-h-0 min-w-0">{children}</section>
      {detail ? (
        <aside className="hidden min-w-0 border-l xl:block">{detail}</aside>
      ) : null}
    </div>
  )
}
