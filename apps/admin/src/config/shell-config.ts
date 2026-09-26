import { WorkspaceShellProps } from "@shurokkha/ui/layout/workspace-shell"

export const adminShellConfig = {
  headerHeight: "3.5rem",
  sidebarWidth: "17rem",
  sidebarIconWidth: "3.5rem",
  contentWidth: "wide",
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
