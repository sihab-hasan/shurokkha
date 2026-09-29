import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { Can } from "@/components/auth/can"
import { NewsTable } from "@/components/operations"

export const metadata: Metadata = {
  title: "News",
  description: "Manage editorial news articles on the public feed.",
}

export default function NewsPage() {
  return (
    <Section className="py-8 sm:py-10">
      <Container className="space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">News</h1>
            <p className="text-sm text-muted-foreground">
              Editorial articles and announcements for the public news feed.
            </p>
          </div>
          <Can role="admin">
            <Button
              nativeButton={false}
              render={<Link href={adminRoutes.operations.news.new} />}
            >
              <Plus className="size-4" /> New Article
            </Button>
          </Can>
        </header>

        <NewsTable />
      </Container>
    </Section>
  )
}
