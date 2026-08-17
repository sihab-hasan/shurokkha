import { CircleCheckBig, HeartHandshake, RadioTower } from "lucide-react"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { SectionHeader } from "@shurokkha/ui-patterns/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

const phases = [
  {
    label: "Before",
    title: "Prepare and understand risk",
    description:
      "Follow relevant alerts, identify nearby shelters and resources, and keep trusted guidance easy to reach before conditions worsen.",
    icon: CircleCheckBig,
  },
  {
    label: "During",
    title: "Respond with clearer information",
    description:
      "Request assistance, find verified services, review operational updates, and reduce uncertainty while response is active.",
    icon: RadioTower,
  },
  {
    label: "After",
    title: "Recover and rebuild together",
    description:
      "Coordinate volunteering, donations, resource distribution, follow-up support, and transparent recovery activity over time.",
    icon: HeartHandshake,
  },
] as const

export function RecoveryCycleSection() {
  return (
    <section className="bg-muted/35 py-12 sm:py-16 lg:py-20">
      <ContentContainer className="py-0">
        <SectionHeader
          eyebrow="Across the disaster cycle"
          title="Support should change as the situation changes"
          description="Shurokkha is designed as more than an emergency screen. The same information architecture can support preparedness, active response, and recovery."
          align="left"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {phases.map(({ label, title, description, icon: Icon }) => (
            <Card key={label} className="h-full bg-background/90 shadow-xs">
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {label}
                </p>
                <CardTitle className="text-lg">{title}</CardTitle>
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
