import Link from "next/link"
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  UsersRound,
} from "lucide-react"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { SectionHeader } from "@shurokkha/ui-patterns/navigation"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

const roles = [
  {
    title: "Citizens",
    description:
      "Receive relevant information, request help, find shelters and services, and understand what happens next.",
    href: "/get-help",
    action: "Explore help",
    icon: ShieldCheck,
  },
  {
    title: "Volunteers",
    description:
      "Discover opportunities, understand assignments, contribute skills, and build a transparent record of service.",
    href: "/volunteers",
    action: "Volunteer",
    icon: UsersRound,
  },
  {
    title: "Donors and partners",
    description:
      "Support verified needs, follow campaigns and impact, and coordinate resources with clearer accountability.",
    href: "/donate",
    action: "Support recovery",
    icon: HeartHandshake,
  },
] as const

export function ParticipationSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <ContentContainer className="py-0">
        <SectionHeader
          eyebrow="Shared participation"
          title="Different roles, one connected response system"
          description="Each person sees the actions relevant to them while the underlying response journey stays coordinated."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {roles.map(({ title, description, href, action, icon: Icon }) => (
            <Card key={title} className="h-full shadow-xs">
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="leading-7 text-muted-foreground">{description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  nativeButton={false}
                  variant="outline"
                  render={<Link href={href} />}
                >
                  {action}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ContentContainer>
    </section>
  )
}
