import { EmergencyHelpIcon } from "@shurokkha/ui/icons/emergency-help-icon"
import { NotificationIcon } from "@shurokkha/ui/icons/notification-icon"
import { ResourceIcon } from "@shurokkha/ui/icons/resource-icon"
import { VolunteerIcon } from "@shurokkha/ui/icons/volunteer-icon"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"
import { ProcessSteps } from "@shurokkha/ui/components/misc"
import { Card, CardContent } from "@shurokkha/ui/components/card"

const steps = [
  {
    id: "stay-informed",
    title: "Stay informed",
    description:
      "Review verified alerts, safety guidance, and location-aware updates relevant to your situation.",
    indicator: <NotificationIcon className="size-4" />,
    status: "complete" as const,
  },
  {
    id: "request-help",
    title: "Request help",
    description:
      "Share the essential details responders need to assess urgency and coordinate appropriate assistance.",
    indicator: <EmergencyHelpIcon className="size-4" />,
    status: "complete" as const,
  },
  {
    id: "find-resources",
    title: "Find resources",
    description:
      "Locate shelters, services, supplies, campaigns, and other verified support through one consistent experience.",
    indicator: <ResourceIcon className="size-4" />,
    status: "complete" as const,
  },
  {
    id: "recover-together",
    title: "Recover together",
    description:
      "Volunteer, donate, follow recovery activity, and help communities move from response toward resilience.",
    indicator: <VolunteerIcon className="size-4" />,
    status: "complete" as const,
  },
]

export function StepsSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <Section className="py-0">
        <Container>
          <SectionHeader
            eyebrow="The core journey"
            title="Four connected actions, supported by trusted context"
            description="The experience guides people from understanding a situation to taking the next useful step without forcing them through disconnected systems."
          />
          <Card className="shadow-xs">
            <CardContent className="py-5 sm:py-7">
              <ProcessSteps
                steps={steps}
                orientation="horizontal"
                numbered={false}
              />
            </CardContent>
          </Card>
        </Container>
      </Section>
    </section>
  )
}
