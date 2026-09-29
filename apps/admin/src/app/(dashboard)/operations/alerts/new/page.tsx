import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { RequireRole } from "@/components/auth/require-role"
import { AlertForm } from "@/components/operations"

export const metadata: Metadata = {
  title: "New Alert",
  description: "Publish a new public alert or emergency broadcast.",
}

export default function NewAlertPage() {
  return (
    <RequireRole role="admin">
      <Section className="py-8 sm:py-10">
        <Container className="max-w-xl space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 w-fit"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.alerts.list} />}
          >
            <ArrowLeft className="size-4" /> Back to Alerts
          </Button>

          <header>
            <h1 className="text-2xl font-semibold tracking-tight">New Alert</h1>
            <p className="text-sm text-muted-foreground">
              Publish a public alert broadcast to the news feed.
            </p>
          </header>

          <AlertForm />
        </Container>
      </Section>
    </RequireRole>
  )
}
