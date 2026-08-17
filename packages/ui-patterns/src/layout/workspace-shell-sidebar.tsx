import * as React from "react"
import { Sidebar } from "@shurokkha/ui/components/sidebar"
import { cn } from "@shurokkha/ui/lib/utils"

export type WorkspaceShellSidebarProps = React.ComponentProps<typeof Sidebar>

/**
 * Sidebar tuned for WorkspaceShell. Desktop offset/height is derived from the shell
 * header token so applications never hard-code `top-14` or matching calc values.
 */
export function WorkspaceShellSidebar({
  className,
  ...props
}: WorkspaceShellSidebarProps) {
  return (
    <Sidebar
      className={cn(
        "border-r-0! md:top-[var(--workspace-shell-header-height)] md:h-[calc(100svh-var(--workspace-shell-header-height))]",
        className
      )}
      {...props}
    />
  )
}
