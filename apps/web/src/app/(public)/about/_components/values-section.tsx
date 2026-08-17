import { BadgeCheck, HandHeart, Network, ShieldCheck } from "lucide-react"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { SectionHeader } from "@shurokkha/ui-patterns/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

const values = [
  {
    title: "Trust before speed",
    description:
      "Critical information should carry enough source, status, and verification context for people to judge it responsibly.",
    icon: BadgeCheck,
  },
  {
    title: "People before process",
    description:
      "Support journeys should be understandable, accessible, respectful, and designed around real human needs—not administrative complexity.",
    icon: HandHeart,
  },
  {
    title: "Coordination over silos",
    description:
      "Information, needs, resources, and response activity become more useful when the right context can move between the right people.",
    icon: Network,
  },
  {
    title: "Safety by design",
    description:
      "Privacy, responsible disclosure, clear permissions, and transparent product boundaries should be built in from the beginning.",
    icon: ShieldCheck,
  },
] as const

export function ValuesSection() {
  return (
    <section className="bg-muted/35 py-12 sm:py-16 lg:py-20">
      <ContentContainer className="py-0">
        <SectionHeader
          eyebrow="Our principles"
          title="What guides the way Shurokkha is designed"
          description="The platform should make useful action easier without sacrificing clarity, dignity, safety, or accountability."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              size="sm"
              className="h-full bg-background/85 shadow-xs"
            >
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentContainer>
    </section>
  )
}
