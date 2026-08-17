import {
  Accessibility,
  Flame,
  Handshake,
  Info,
  LifeBuoy,
  RadioTower,
  ShieldAlert,
  Siren,
  Users,
} from "lucide-react"

import { SectionHeader } from "@shurokkha/ui-patterns/navigation"
import { Card, CardContent } from "@shurokkha/ui/components/card"

const shurokkhaOptions = [
  {
    title: "Help using Shurokkha",
    description:
      "Questions about accounts, access, public features, assistance requests, shelters, profiles, or using the platform.",
    icon: LifeBuoy,
  },
  {
    title: "Organizations and partnerships",
    description:
      "For NGOs, community organizations, shelter operators, institutions, or teams interested in coordination and collaboration.",
    icon: Handshake,
  },
  {
    title: "Accessibility, privacy, and safety",
    description:
      "Report an accessibility barrier, privacy concern, unsafe content, misuse, or another issue that may affect people using the platform.",
    icon: Accessibility,
  },
  {
    title: "Community and volunteer coordination",
    description:
      "Questions about volunteering, community participation, local response activity, or responsible ways to contribute.",
    icon: Users,
  },
] as const

const helplines = [
  {
    number: "999",
    title: "National emergency service",
    description: "Police, fire, and ambulance emergency support in Bangladesh.",
    icon: Siren,
  },
  {
    number: "102",
    title: "Fire Service and Civil Defence",
    description: "Fire, rescue, and related emergency assistance.",
    icon: Flame,
  },
  {
    number: "1090",
    title: "Disaster and weather information",
    description:
      "Government IVR information for weather, cyclone, river-port, and flood conditions.",
    icon: RadioTower,
  },
  {
    number: "333",
    title: "Government information and services",
    description:
      "National information, public-service guidance, grievances, and disaster-related assistance requests.",
    icon: Info,
  },
  {
    number: "109",
    title: "Violence against women and children",
    description:
      "National helpline for support, guidance, and referral services.",
    icon: ShieldAlert,
  },
  {
    number: "1098",
    title: "Child Helpline",
    description:
      "24-hour support for children experiencing violence, abuse, exploitation, or distress.",
    icon: LifeBuoy,
  },
] as const

export function ContactOptions() {
  return (
    <div className="space-y-10">
      <div>
        <SectionHeader
          eyebrow="Contact Shurokkha"
          title="Choose the route that best matches your enquiry"
          description="Use the message form for Shurokkha-related questions and coordination. For emergencies or specialist public services, contact the relevant official helpline directly."
          align="left"
          className="mb-6"
        />

        <div className="grid gap-3">
          {shurokkhaOptions.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="flex gap-3 rounded-xl bg-muted/40 p-4 sm:p-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-xs">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-heading font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4">
          <p className="text-sm font-medium text-primary">
            Official Bangladesh helplines
          </p>
          <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            Important numbers to keep within reach
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            These services are operated by government agencies and are separate
            from Shurokkha. Use the service that matches the situation.
          </p>
        </div>

        <Card className="overflow-hidden shadow-xs">
          <CardContent className="p-0">
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {helplines.map(({ number, title, description, icon: Icon }) => (
                <a
                  key={number}
                  href={`tel:${number}`}
                  className="group flex min-h-28 gap-3 p-4 transition-colors hover:bg-muted/45 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset sm:p-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <strong className="font-heading text-lg text-foreground">
                        {number}
                      </strong>
                      <span className="text-sm font-medium text-foreground">
                        {title}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                      {description}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
