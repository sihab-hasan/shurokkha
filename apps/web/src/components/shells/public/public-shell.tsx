import type { ReactNode } from "react"

import { SiteShell } from "@shurokkha/ui-patterns/layout"

import PublicFooter from "./public-footer"
import PublicHeader from "./public-header"

export interface PublicShellProps {
  children: ReactNode
}

/** Public website chrome: announcement/navigation header, page flow and footer. */
export function PublicShell({ children }: PublicShellProps) {
  return (
    <SiteShell header={<PublicHeader />} footer={<PublicFooter />}>
      {children}
    </SiteShell>
  )
}
