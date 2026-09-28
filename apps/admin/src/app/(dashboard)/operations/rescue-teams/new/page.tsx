import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { RequireRole } from "@/components/auth/require-role"
import { RescueTeamForm } from "@/components/operations"

export const metadata: Metadata = {
  title: "New Rescue Team",
  description: "Register a new rescue team.",
}

export default function NewRescueTeamPage() {
  return (
    <RequireRole role="admin">
      <Section className="py-8 sm:py-10">
        <Container className="max-w-xl space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 w-fit"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.rescueTeams.list} />}
          >
            <ArrowLeft className="size-4" /> Back to Rescue Teams
          </Button>

          <header>
            <h1 className="text-2xl font-semibold tracking-tight">
              New Rescue Team
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in the form to register a new rescue team in the database.
            </p>
          </header>

          <RescueTeamForm />
        </Container>
      </Section>
    </RequireRole>
  )
}
