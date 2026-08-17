import type { ReactNode } from "react"

import {
  ContentContainer,
  SidebarLayout,
  SiteShell,
} from "@shurokkha/ui-patterns/layout"

import { docsShellConfig } from "@/config/shell-config"

import { DocsHeader } from "./docs-header"
import { DocsSidebar } from "./docs-sidebar"

export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <SiteShell header={<DocsHeader />}>
      <ContentContainer
        size={docsShellConfig.contentWidth}
        padding={docsShellConfig.contentPadding}
        className="py-8 lg:py-10"
      >
        <SidebarLayout
          sidebar={<DocsSidebar />}
          sidebarWidth={docsShellConfig.sidebarWidth}
          stickyOffset={docsShellConfig.sidebarStickyOffset}
          className="gap-8"
        >
          {children}
        </SidebarLayout>
      </ContentContainer>
    </SiteShell>
  )
}
