import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"
import { Button } from "@shurokkha/ui/components/button"

export function HowItWorksHero() {
  return (
    <section className="bg-gradient-to-b from-primary/[0.07] via-background to-background">
      <ContentContainer className="py-16 sm:py-20 lg:py-24">
        <PageHeader
          eyebrow="How Shurokkha works"
          title="One coordinated path from awareness to recovery."
          className="max-w-6xl [&_h1]:text-4xl sm:[&_h1]:text-5xl lg:[&_h1]:text-5xl [&_p]:max-w-3xl [&_p]:text-base sm:[&_p]:text-lg"
          description="Shurokkha helps people understand changing conditions, find or request support, locate trusted resources, and participate in community recovery through a connected set of public and role-based experiences."
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                nativeButton={false}
                size="lg"
                render={<Link href="/get-help" />}
              >
                Get help
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                nativeButton={false}
                size="lg"
                variant="outline"
                render={<Link href="/shelters" />}
              >
                Find shelters
              </Button>
            </div>
          }
        />
      </ContentContainer>
    </section>
  )
}
