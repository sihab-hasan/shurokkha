import type { ReactNode } from "react"

import { WorkspaceShell } from "@shurokkha/ui-patterns/layout"

import { adminShellConfig } from "@/config/shell-config"

import { AdminHeader } from "./admin-header"
import { AdminSidebar } from "./admin-sidebar"

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <WorkspaceShell
      {...adminShellConfig}
      header={<AdminHeader />}
      sidebar={<AdminSidebar />}
      mainLabel="Shurokkha administration workspace"
    >
      {children}
    </WorkspaceShell>
  )
}
