import Link from "next/link"
import { ArrowRight, HandHeart, Network, ShieldCheck } from "lucide-react"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { SectionHeader } from "@shurokkha/ui-patterns/navigation"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

const steps = [
  {
    title: "Understand",
    description:
      "Bring alerts, disaster context, trusted updates, and relevant local information into a clearer view of what is happening.",
    icon: ShieldCheck,
  },
  {
    title: "Connect",
    description:
      "Help people move from information to action by finding assistance pathways, shelters, resources, volunteers, and ways to contribute.",
    icon: Network,
  },
  {
    title: "Recover together",
    description:
      "Keep community participation, follow-up, transparency, and recovery visible after the immediate emergency response has passed.",
    icon: HandHeart,
  },
] as const

export function HowWeWorkSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <ContentContainer className="py-0">
        <SectionHeader
          eyebrow="What the platform helps people do"
          title="Understand the situation, reach support, and stay connected through recovery"
          description="Shurokkha is organized around practical journeys rather than isolated features, so the next useful action is easier to find."
          align="left"
          actions={
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/about/how-it-works" />}
            >
              Explore how it works
              <ArrowRight data-icon="inline-end" />
            </Button>
          }
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="h-full shadow-xs">
              <CardHeader>
                <span className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentContainer>
    </section>
  )
}
