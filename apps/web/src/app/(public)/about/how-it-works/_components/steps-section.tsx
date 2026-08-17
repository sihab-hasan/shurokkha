import { EmergencyHelpIcon } from "@shurokkha/icons/emergency-help-icon"
import { NotificationIcon } from "@shurokkha/icons/notification-icon"
import { ResourceIcon } from "@shurokkha/icons/resource-icon"
import { VolunteerIcon } from "@shurokkha/icons/volunteer-icon"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { SectionHeader } from "@shurokkha/ui-patterns/navigation"
import { ProcessSteps } from "@shurokkha/ui-patterns/progress"
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
      <ContentContainer className="py-0">
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
      </ContentContainer>
    </section>
  )
}
