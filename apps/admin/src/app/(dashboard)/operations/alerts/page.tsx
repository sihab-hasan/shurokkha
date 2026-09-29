import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { Can } from "@/components/auth/can"
import { AlertTable } from "@/components/operations"

export const metadata: Metadata = {
  title: "Alerts",
  description: "Manage public alerts and emergency broadcasts.",
}

export default function AlertsPage() {
  return (
    <Section className="py-8 sm:py-10">
      <Container className="space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Alerts</h1>
            <p className="text-sm text-muted-foreground">
              Active and historical public alerts.
            </p>
          </div>
          <Can role="admin">
            <Button
              nativeButton={false}
              render={<Link href={adminRoutes.operations.alerts.new} />}
            >
              <Plus className="size-4" /> New Alert
            </Button>
          </Can>
        </header>

        <AlertTable />
      </Container>
    </Section>
  )
}
