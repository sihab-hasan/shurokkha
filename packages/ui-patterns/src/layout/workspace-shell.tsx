import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"
import { SidebarInset, SidebarProvider } from "@shurokkha/ui/components/sidebar"

import { ContentContainer } from "./content-container"
import type { ContentPadding, ContentWidth } from "./layout-tokens"

export type WorkspaceShellProps = Omit<
  React.ComponentProps<typeof SidebarProvider>,
  "children"
> & {
  header?: React.ReactNode
  sidebar?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  contentClassName?: string
  insetClassName?: string
  scrollClassName?: string
  contentWidth?: ContentWidth
  contentPadding?: ContentPadding
  headerHeight?: string
  sidebarWidth?: string
  sidebarIconWidth?: string
  viewportLocked?: boolean
  footerMode?: "flow" | "fixed"
  mainId?: string
  mainLabel?: string
  skipLinkLabel?: string
}

/**
 * Application workspace shell.
 *
 * Owns viewport locking, shell sizing tokens, the sidebar/header relationship,
 * the main scroll container and content gutters. Apps provide branded header,
 * navigation sidebar and domain content as slots instead of duplicating shell CSS.
 */
export function WorkspaceShell({
  header,
  sidebar,
  children,
  footer,
  className,
  contentClassName,
  insetClassName,
  scrollClassName,
  contentWidth = "default",
  contentPadding = "default",
  headerHeight = "3.5rem",
  sidebarWidth = "16rem",
  sidebarIconWidth = "3.5rem",
  viewportLocked = true,
  footerMode = "flow",
  mainId = "main-content",
  mainLabel,
  skipLinkLabel = "Skip to main content",
  style,
  ...props
}: WorkspaceShellProps) {
  const effectiveHeaderHeight = header ? headerHeight : "0px"

  const mainContent = (
    <ContentContainer
      size={contentWidth}
      padding={contentPadding}
      className={contentClassName}
    >
      {children}
    </ContentContainer>
  )

  return (
    <SidebarProvider
      data-ui-pattern="workspace-shell"
      className={cn(
        "flex-col bg-background text-foreground",
        viewportLocked ? "h-svh min-h-0 overflow-hidden" : "min-h-svh",
        className
      )}
      style={
        {
          "--workspace-shell-header-height": effectiveHeaderHeight,
          "--sidebar-width": sidebarWidth,
          "--sidebar-width-icon": sidebarIconWidth,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <a
        href={`#${mainId}`}
        className="sr-only z-[100] rounded-md bg-background px-3 py-2 text-sm font-medium shadow-overlay focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {skipLinkLabel}
      </a>

      {header ? (
        <div
          data-shell-slot="header"
          className="h-(--workspace-shell-header-height) shrink-0"
        >
          {header}
        </div>
      ) : null}

      <div
        data-shell-slot="body"
        className={cn(
          "flex min-h-0 min-w-0 flex-1",
          !viewportLocked && "min-h-svh"
        )}
      >
        {sidebar}
        <SidebarInset
          id={mainId}
          tabIndex={-1}
          aria-label={mainLabel}
          data-shell-slot="main"
          className={cn(
            "min-h-0 min-w-0 bg-background text-foreground outline-none",
            viewportLocked && "h-full overflow-hidden",
            insetClassName
          )}
        >
          <div
            data-shell-slot="scroll-region"
            className={cn(
              "min-h-0 min-w-0 flex-1",
              viewportLocked &&
                "overflow-y-auto overscroll-contain [scrollbar-gutter:stable]",
              scrollClassName
            )}
          >
            {mainContent}
            {footer && footerMode === "flow" ? (
              <div data-shell-slot="footer">{footer}</div>
            ) : null}
          </div>
          {footer && footerMode === "fixed" ? (
            <div data-shell-slot="footer" className="shrink-0">
              {footer}
            </div>
          ) : null}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
