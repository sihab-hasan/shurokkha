import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type WorkspaceShellHeaderProps = React.ComponentProps<"header">

/** Header chrome that inherits its height from WorkspaceShell's header token. */
export function WorkspaceShellHeader({
  className,
  ...props
}: WorkspaceShellHeaderProps) {
  return (
    <header
      data-ui-pattern="workspace-shell-header"
      className={cn(
        "flex h-full w-full min-w-0 shrink-0 items-center border-b bg-sidebar text-sidebar-foreground",
        className
      )}
      {...props}
    />
  )
}
