import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type ExplorerLayoutProps = React.ComponentProps<"div"> & {
  controls: React.ReactNode
  children: React.ReactNode
  detail?: React.ReactNode
  controlsWidth?: string
  detailWidth?: string
  minHeight?: string
  contained?: boolean
}

export function ExplorerLayout({
  controls,
  children,
  detail,
  controlsWidth = "17.5rem",
  detailWidth = "20rem",
  minHeight = "45rem",
  contained = true,
  className,
  style,
  ...props
}: ExplorerLayoutProps) {
  return (
    <div
      data-ui-pattern="explorer-layout"
      className={cn(
        "grid min-w-0 overflow-hidden lg:grid-cols-[var(--pattern-explorer-controls)_minmax(0,1fr)]",
        detail &&
          "lg:grid-cols-[var(--pattern-explorer-controls)_minmax(0,1fr)_var(--pattern-explorer-detail)]",
        contained && "rounded-xl border bg-card shadow-xs",
        className
      )}
      style={
        {
          "--pattern-explorer-controls": controlsWidth,
          "--pattern-explorer-detail": detailWidth,
          minHeight,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <aside className="min-w-0 border-b lg:border-r lg:border-b-0">
        {controls}
      </aside>
      <section className="relative min-h-[28rem] min-w-0 overflow-hidden">
        {children}
      </section>
      {detail ? (
        <aside className="min-w-0 border-t lg:border-t-0 lg:border-l">
          {detail}
        </aside>
      ) : null}
    </div>
  )
}
