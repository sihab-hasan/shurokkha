import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { VolunteerTable } from "@/components/operations"

export const metadata: Metadata = {
  title: "Volunteers",
  description: "Review and manage volunteer applications.",
}

export default function VolunteersPage() {
  return (
    <Section className="py-8 sm:py-10">
      <Container className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Volunteers</h1>
          <p className="text-sm text-muted-foreground">
            Citizen volunteer applications. Approve or reject pending
            submissions.
          </p>
        </header>

        <VolunteerTable />
      </Container>
    </Section>
  )
}
