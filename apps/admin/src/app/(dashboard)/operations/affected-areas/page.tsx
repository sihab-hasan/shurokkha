import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { Can } from "@/components/auth/can"
import { AffectedAreaTable } from "@/components/operations"

export const metadata: Metadata = {
  title: "Affected Areas",
  description: "Live list of areas impacted by active disasters.",
}

export default function AffectedAreasPage() {
  return (
    <Section className="py-8 sm:py-10">
      <Container className="space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Affected Areas
            </h1>
            <p className="text-sm text-muted-foreground">
              All areas currently linked to a registered disaster.
            </p>
          </div>
          <Can role="admin">
            <Button
              nativeButton={false}
              render={<Link href={adminRoutes.operations.affectedAreas.new} />}
            >
              <Plus className="size-4" /> New Affected Area
            </Button>
          </Can>
        </header>

        <AffectedAreaTable />
      </Container>
    </Section>
  )
}
