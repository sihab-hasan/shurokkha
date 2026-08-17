import Link from "next/link"
import { ArrowRight, BadgeCheck, Eye, LockKeyhole } from "lucide-react"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { SectionHeader } from "@shurokkha/ui-patterns/navigation"
import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"

const commitments = [
  {
    title: "Context people can evaluate",
    description:
      "Important information should make its source, status, timing, and verification context understandable wherever possible.",
    icon: BadgeCheck,
  },
  {
    title: "Privacy-aware participation",
    description:
      "Public visibility should be intentional. Personal information should be limited to what is necessary for the relevant purpose.",
    icon: LockKeyhole,
  },
  {
    title: "Clear product boundaries",
    description:
      "Shurokkha should be explicit about what the platform can help with, what it cannot verify, and when people should use official emergency services instead.",
    icon: Eye,
  },
] as const

export function TrustSafetySection() {
  return (
    <section className="bg-primary/[0.06] py-12 sm:py-16 lg:py-20">
      <ContentContainer size="narrow" className="py-0">
        <SectionHeader
          eyebrow="Trust, safety, and responsibility"
          title="Helpful technology needs clear boundaries"
          description="Shurokkha is designed to support disaster information and coordination. It is not a replacement for police, fire, ambulance, government authorities, or other emergency services."
        />

        <Card className="bg-background/90 shadow-xs">
          <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-3">
            {commitments.map(({ title, description, icon: Icon }) => (
              <div key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/transparency" />}
          >
            Transparency and accountability
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button nativeButton={false} render={<Link href="/contact" />}>
            Contact Shurokkha
          </Button>
        </div>
      </ContentContainer>
    </section>
  )
}
