import type { ReactNode } from "react"

import { Container } from "@shurokkha/ui/layout/container"

import { SettingsNav } from "./_components/settings-nav"

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 pt-2 sm:pt-4">
      <Container padded={false}>
        <SettingsNav />
      </Container>
      <Container padded={false} className="space-y-6">
        {children}
      </Container>
    </div>
  )
}
