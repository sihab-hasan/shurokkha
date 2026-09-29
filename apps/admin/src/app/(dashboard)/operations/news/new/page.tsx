import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { RequireRole } from "@/components/auth/require-role"
import { NewsForm } from "@/components/operations"

export const metadata: Metadata = {
  title: "New Article",
  description: "Publish a new editorial news article.",
}

export default function NewNewsPage() {
  return (
    <RequireRole role="admin">
      <Section className="py-8 sm:py-10">
        <Container className="max-w-2xl space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 w-fit"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.news.list} />}
          >
            <ArrowLeft className="size-4" /> Back to News
          </Button>

          <header>
            <h1 className="text-2xl font-semibold tracking-tight">
              New News Article
            </h1>
            <p className="text-sm text-muted-foreground">
              Draft and publish editorial content for the public feed.
            </p>
          </header>

          <NewsForm />
        </Container>
      </Section>
    </RequireRole>
  )
}
