import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Internal operations dashboard for Shurokkha administrators.",
}

export default function DashboardHomePage() {
  return (
    <Section className="py-8 sm:py-12">
      <Container className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Select a section from the navigation to manage response operations.
          </p>
        </header>
      </Container>
    </Section>
  )
}
