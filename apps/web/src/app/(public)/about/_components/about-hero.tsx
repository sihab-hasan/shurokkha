import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Button } from "@shurokkha/ui/components/button"

export function AboutHero() {
  return (
    <section className="bg-gradient-to-b from-primary/[0.07] via-background to-background">
      <Section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <PageHeader
            eyebrow="About Shurokkha"
            title="A clearer path from crisis information to coordinated action."
            className="max-w-6xl [&_h1]:text-4xl sm:[&_h1]:text-5xl lg:[&_h1]:text-5xl [&_p]:max-w-3xl [&_p]:text-base sm:[&_p]:text-lg"
            description="Shurokkha is a disaster-support platform designed to help people understand changing situations, find trusted support pathways, discover shelters and resources, and take part in community response and recovery from one connected experience."
            actions={
              <div className="flex flex-wrap gap-2">
                <Button
                  nativeButton={false}
                  size="lg"
                  render={<Link href="/about/how-it-works" />}
                >
                  How Shurokkha works
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button
                  nativeButton={false}
                  variant="outline"
                  size="lg"
                  render={<Link href="/contact" />}
                >
                  Contact Shurokkha
                </Button>
              </div>
            }
          />
        </Container>
      </Section>
    </section>
  )
}
