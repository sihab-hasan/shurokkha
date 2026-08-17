import { HeartHandshake, Target } from "lucide-react"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { SectionHeader } from "@shurokkha/ui-patterns/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

const statements = [
  {
    title: "Our mission",
    description:
      "Make reliable disaster support easier to understand, reach, and coordinate.",
    content:
      "Shurokkha is designed around the decisions people face before, during, and after a crisis. We bring useful information and support pathways closer together so affected people can act sooner, responders can share clearer context, and communities can remain connected through recovery.",
    icon: HeartHandshake,
  },
  {
    title: "Our vision",
    description:
      "Communities that can prepare, respond, and recover with stronger shared awareness.",
    content:
      "We envision a disaster-response ecosystem where citizens, volunteers, donors, community organizations, and responsible institutions can work from clearer information and more connected workflows—without losing sight of safety, dignity, privacy, or accountability.",
    icon: Target,
  },
] as const

export function MissionSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <ContentContainer className="py-0">
        <SectionHeader
          eyebrow="Why we exist"
          title="Support should be easier to understand when the situation is hardest"
          description="Disasters create information gaps, urgent needs, and fragmented support. Shurokkha is designed to reduce that friction by connecting trusted context with practical next steps."
          align="left"
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {statements.map(({ title, description, content, icon: Icon }) => (
            <Card key={title} className="h-full shadow-xs">
              <CardHeader>
                <span className="mb-3 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="max-w-xl leading-6">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="max-w-2xl leading-7 text-muted-foreground">
                  {content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentContainer>
    </section>
  )
}
