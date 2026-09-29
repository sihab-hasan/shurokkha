import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { RequireRole } from "@/components/auth/require-role"
import { GuideForm } from "@/components/operations"

export const metadata: Metadata = {
  title: "New Guide",
  description: "Publish a new preparedness or recovery guide.",
}

export default function NewGuidePage() {
  return (
    <RequireRole role="admin">
      <Section className="py-8 sm:py-10">
        <Container className="max-w-2xl space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 w-fit"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.guides.list} />}
          >
            <ArrowLeft className="size-4" /> Back to Guides
          </Button>

          <header>
            <h1 className="text-2xl font-semibold tracking-tight">New Guide</h1>
            <p className="text-sm text-muted-foreground">
              Publish a new article in the knowledge base.
            </p>
          </header>

          <GuideForm />
        </Container>
      </Section>
    </RequireRole>
  )
}
