import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { RequireRole } from "@/components/auth/require-role"
import { FundraiseForm } from "@/components/operations"

export const metadata: Metadata = {
  title: "New Campaign",
  description: "Create a new donation campaign.",
}

export default function NewFundraisePage() {
  return (
    <RequireRole role="admin">
      <Section className="py-8 sm:py-10">
        <Container className="max-w-2xl space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 w-fit"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.fundraises.list} />}
          >
            <ArrowLeft className="size-4" /> Back to Fundraises
          </Button>

          <header>
            <h1 className="text-2xl font-semibold tracking-tight">
              New Fundraise Campaign
            </h1>
            <p className="text-sm text-muted-foreground">
              Launch a new donation campaign for the public.
            </p>
          </header>

          <FundraiseForm />
        </Container>
      </Section>
    </RequireRole>
  )
}
