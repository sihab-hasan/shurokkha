import type { ReactNode } from "react"

import { WorkspaceShell } from "@shurokkha/ui-patterns/layout"

import type { AppRole } from "@/config/app-navigation"
import { appShellConfig } from "@/config/shell-config"
import { AuthGate } from "@/components/auth/auth-gate"

import AppHeader from "./app-header"
import AppSidebar from "./app-sidebar"

export interface AppShellProps {
  children: ReactNode
  role: AppRole
}

/** Signed-in Shurokkha product shell. Role config selects navigation and identity chrome. */
export function AppShell({ children, role }: AppShellProps) {
  return (
    <AuthGate role={role}>
      <WorkspaceShell
        {...appShellConfig}
        header={<AppHeader role={role} />}
        sidebar={<AppSidebar role={role} />}
        mainLabel={`${role} application workspace`}
      >
        {children}
      </WorkspaceShell>
    </AuthGate>
  )
}
