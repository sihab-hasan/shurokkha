import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type SidebarLayoutProps = React.ComponentProps<"div"> & {
  sidebar: React.ReactNode
  sidebarPosition?: "start" | "end"
  sidebarWidth?: string
  stickySidebar?: boolean
  stickyOffset?: string
}

export function SidebarLayout({
  sidebar,
  sidebarPosition = "start",
  sidebarWidth = "18rem",
  stickySidebar = true,
  stickyOffset = "1.5rem",
  className,
  children,
  style,
  ...props
}: SidebarLayoutProps) {
  return (
    <div
      data-ui-pattern="sidebar-layout"
      className={cn(
        "grid min-w-0 gap-6 lg:grid-cols-[var(--pattern-sidebar-width)_minmax(0,1fr)]",
        sidebarPosition === "end" &&
          "lg:grid-cols-[minmax(0,1fr)_var(--pattern-sidebar-width)]",
        className
      )}
      style={
        {
          "--pattern-sidebar-width": sidebarWidth,
          "--pattern-sidebar-sticky-offset": stickyOffset,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <aside
        className={cn(
          "min-w-0",
          stickySidebar &&
            "lg:sticky lg:top-[var(--pattern-sidebar-sticky-offset)] lg:self-start",
          sidebarPosition === "end" && "lg:order-2"
        )}
      >
        {sidebar}
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
