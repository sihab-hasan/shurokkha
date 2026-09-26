import type { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "@shurokkha/ui/components/sidebar"

import type { UserRole } from "@/lib/rbac"
import { AuthGate } from "@/components/auth/auth-gate"

import AccountHeader from "./account-header"
import AccountSidebar from "./account-sidebar"

export interface AccountShellProps {
  children: ReactNode
  role?: UserRole
}

/** Signed-in Shurokkha account shell. Role config selects navigation and identity chrome. */
export function AccountShell({ children, role }: AccountShellProps) {
  return (
    <AuthGate role={role}>
      <SidebarProvider defaultOpen>
        <AccountSidebar role={role} />
        <SidebarInset>
          <AccountHeader role={role} />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGate>
  )
}
