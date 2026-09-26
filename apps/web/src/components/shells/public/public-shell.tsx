import type { ReactNode } from "react"

import PublicFooter from "./public-footer"
import PublicHeader from "./public-header"

interface PublicShellProps {
  children: ReactNode
}

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}
