import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { RequireRole } from "@/components/auth/require-role"
import { AffectedAreaForm } from "@/components/operations"

export const metadata: Metadata = {
  title: "New Affected Area",
  description: "Register a new affected area for an active disaster.",
}

export default function NewAffectedAreaPage() {
  return (
    <RequireRole role="admin">
      <Section className="py-8 sm:py-10">
        <Container className="max-w-xl space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 w-fit"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.affectedAreas.list} />}
          >
            <ArrowLeft className="size-4" /> Back to Affected Areas
          </Button>

          <header>
            <h1 className="text-2xl font-semibold tracking-tight">
              New Affected Area
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in the form to register a new affected area in the database.
            </p>
          </header>

          <AffectedAreaForm />
        </Container>
      </Section>
    </RequireRole>
  )
}
