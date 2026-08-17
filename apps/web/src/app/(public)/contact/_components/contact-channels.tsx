import {
  Accessibility,
  Handshake,
  LifeBuoy,
  MessageSquareText,
} from "lucide-react"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { SectionHeader } from "@shurokkha/ui-patterns/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

const channels = [
  {
    title: "Product support",
    description:
      "Account access, navigation, features, technical issues, or questions about using Shurokkha.",
    icon: LifeBuoy,
  },
  {
    title: "Partnerships and coordination",
    description:
      "For organizations exploring response, resource, shelter, volunteer, or community collaboration.",
    icon: Handshake,
  },
  {
    title: "Accessibility and safety",
    description:
      "Report an accessibility barrier, harmful content concern, privacy issue, or safety-related product problem.",
    icon: Accessibility,
  },
  {
    title: "General enquiries",
    description:
      "For media, feedback, research, or questions that do not fit another category, send us the relevant context.",
    icon: MessageSquareText,
  },
] as const

export function ContactChannels() {
  return (
    <section className="bg-muted/35 py-14 sm:py-18 lg:py-20">
      <ContentContainer>
        <SectionHeader
          eyebrow="Contact options"
          title="Choose the context that best matches your message"
          description="Clear context makes it easier to route your message to the people best positioned to respond."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              size="sm"
              className="h-full bg-background/90 shadow-sm"
            >
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
