import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { Can } from "@/components/auth/can"
import { WarehouseTable } from "@/components/operations"

export const metadata: Metadata = {
  title: "Warehouses",
  description: "Manage relief warehouses and inventory distribution.",
}

export default function WarehousesPage() {
  return (
    <Section className="py-8 sm:py-10">
      <Container className="space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Warehouses
            </h1>
            <p className="text-sm text-muted-foreground">
              Distribution centers and inventory dispatch.
            </p>
          </div>
          <Can role="admin">
            <Button
              nativeButton={false}
              render={<Link href={adminRoutes.operations.warehouses.new} />}
            >
              <Plus className="size-4" /> New Warehouse
            </Button>
          </Can>
        </header>

        <WarehouseTable />
      </Container>
    </Section>
  )
}
