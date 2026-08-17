import Link from "next/link"
import { BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { SectionHeader } from "@shurokkha/ui-patterns/navigation"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

const safeguards = [
  {
    title: "Verification context",
    description:
      "Important information should make source, status, and trust context understandable.",
    icon: BadgeCheck,
  },
  {
    title: "Privacy-aware sharing",
    description:
      "Public experiences should expose only the information necessary for the intended purpose.",
    icon: LockKeyhole,
  },
  {
    title: "Clear safety boundaries",
    description:
      "Shurokkha supports coordination but does not replace local emergency services or trained responders.",
    icon: ShieldCheck,
  },
] as const

export function TrustSection() {
  return (
    <section className="bg-primary/[0.06] py-12 sm:py-16 lg:py-20">
      <ContentContainer size="narrow" className="py-0">
        <SectionHeader
          eyebrow="Trust by design"
          title="Every step should make the next action clearer—and safer"
          description="Useful workflows are paired with explicit trust, privacy, and safety context so people understand how to use the platform responsibly."
        />
        <div className="grid gap-4">
          {safeguards.map(({ title, description, icon: Icon }) => (
            <Card key={title} size="sm" className="bg-background/90 shadow-xs">
              <CardHeader className="grid grid-cols-[auto_1fr] items-start gap-x-4">
                <span className="row-span-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="pl-[4.5rem]">
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-7 flex justify-center">
          <Button nativeButton={false} render={<Link href="/about" />}>
            Learn about Shurokkha
          </Button>
        </div>
      </ContentContainer>
    </section>
  )
}
