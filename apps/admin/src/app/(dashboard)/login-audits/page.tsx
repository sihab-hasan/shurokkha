import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { LoginAuditTable } from "@/components/operations"

export const metadata: Metadata = {
  title: "Login Audits",
  description: "Authentication history for all users.",
}

export default function LoginAuditsPage() {
  return (
    <Section className="py-8 sm:py-10">
      <Container className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            Login Audits
          </h1>
          <p className="text-sm text-muted-foreground">
            Every authentication event, including successes and failures.
          </p>
        </header>

        <LoginAuditTable />
      </Container>
    </Section>
  )
}
