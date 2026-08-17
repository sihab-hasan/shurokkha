import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type SiteShellProps = React.ComponentProps<"div"> & {
  announcement?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  mainId?: string
  mainClassName?: string
  skipLinkLabel?: string
}

/**
 * Public/documentation shell for header + content + footer experiences.
 * Keeps document/root concerns outside the package while standardizing page flow,
 * min-height behavior and the accessibility skip target.
 */
export function SiteShell({
  announcement,
  header,
  footer,
  children,
  mainId = "main-content",
  mainClassName,
  skipLinkLabel = "Skip to main content",
  className,
  ...props
}: SiteShellProps) {
  return (
    <div
      data-ui-pattern="site-shell"
      className={cn(
        "flex min-h-svh min-w-0 flex-col bg-background text-foreground",
        className
      )}
      {...props}
    >
      <a
        href={`#${mainId}`}
        className="sr-only z-[100] rounded-md bg-background px-3 py-2 text-sm font-medium shadow-overlay focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {skipLinkLabel}
      </a>
      {announcement}
      {header}
      <main
        id={mainId}
        tabIndex={-1}
        data-shell-slot="main"
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col outline-none",
          mainClassName
        )}
      >
        {children}
      </main>
      {footer}
    </div>
  )
}
