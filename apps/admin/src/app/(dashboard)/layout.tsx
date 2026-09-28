import type { ReactNode } from "react"

import { RequireAuth } from "@/components/auth/require-auth"
import { RequireRole } from "@/components/auth/require-role"
import { AdminLayout } from "@/components/shell/admin-layout"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <RequireRole role="admin">
        <AdminLayout>{children}</AdminLayout>
      </RequireRole>
    </RequireAuth>
  )
}
