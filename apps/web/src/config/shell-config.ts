import type { WorkspaceShellProps } from "@shurokkha/ui-patterns/layout"

export const appShellConfig = {
  headerHeight: "3.5rem",
  sidebarWidth: "16rem",
  sidebarIconWidth: "3.5rem",
  contentWidth: "default",
  contentPadding: "default",
  viewportLocked: true,
} satisfies Pick<
  WorkspaceShellProps,
  | "headerHeight"
  | "sidebarWidth"
  | "sidebarIconWidth"
  | "contentWidth"
  | "contentPadding"
  | "viewportLocked"
>
