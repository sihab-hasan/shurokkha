import { Clock3, Route, ShieldCheck } from "lucide-react"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { SectionHeader } from "@shurokkha/ui-patterns/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

const expectations = [
  {
    title: "Responsible routing",
    description:
      "Your message should be directed to the team or workflow best positioned to handle the topic you provide.",
    icon: Route,
  },
  {
    title: "Published response targets",
    description:
      "Production support should publish realistic service targets by enquiry type rather than implying instant non-emergency support.",
    icon: Clock3,
  },
  {
    title: "Privacy-aware handling",
    description:
      "Only information necessary to understand the issue should be collected, retained, or exposed to a support workflow.",
    icon: ShieldCheck,
  },
] as const

export function ResponseExpectations() {
  return (
    <section className="bg-primary/[0.06] py-14 sm:py-18 lg:py-20">
      <ContentContainer>
        <SectionHeader
          eyebrow="What happens next"
          title="A support experience should set clear expectations"
          description="Routing, response timing, and safe information handling should be understandable before a user submits an enquiry."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {expectations.map(({ title, description, icon: Icon }) => (
            <Card key={title} size="sm" className="bg-background/90 shadow-sm">
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
