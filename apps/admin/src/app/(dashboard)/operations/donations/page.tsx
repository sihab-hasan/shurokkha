import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { Can } from "@/components/auth/can"
import { DonationTable } from "@/components/operations"

export const metadata: Metadata = {
  title: "Donations",
  description: "View and manage donation records.",
}

export default function DonationsPage() {
  return (
    <Section className="py-8 sm:py-10">
      <Container className="space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Donations</h1>
            <p className="text-sm text-muted-foreground">
              All donations recorded on the platform.
            </p>
          </div>
          <Can role="admin">
            <Button
              nativeButton={false}
              render={<Link href={adminRoutes.operations.donations.new} />}
            >
              <Plus className="size-4" /> New Donation
            </Button>
          </Can>
        </header>

        <DonationTable />
      </Container>
    </Section>
  )
}
