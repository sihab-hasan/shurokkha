import { HeartPulse, Home, LifeBuoy, PackageOpen } from "lucide-react"

import { ResourceServicesCard } from "./resource-services-card"

const SERVICES = [
  {
    title: "Emergency assistance",
    description:
      "Urgent help requests routed through Shurokkha are matched to verified shelters, rescue teams, and aid distribution points.",
    icon: LifeBuoy,
    href: "/get-help",
  },
  {
    title: "Food and supplies",
    description:
      "Distribution hubs coordinate food, water, hygiene kits, and other essentials. Capacity and supply status is visible on the shelter map.",
    icon: PackageOpen,
    href: "/shelters",
  },
  {
    title: "Medical support",
    description:
      "Coordination with verified medical teams and welfare stations. Call 999 for life-threatening emergencies.",
    icon: HeartPulse,
    href: "/emergency-alerts",
  },
  {
    title: "Recovery support",
    description:
      "Longer-term pathways for affected households — including missing-persons reports, donations tracking, and recovery updates.",
    icon: Home,
    href: "/transparency",
  },
] as const

/**
 * 2-column responsive grid of `ResourceServicesCard`s rendering the
 * four coordinated service lanes on `/resources/support-services`.
 */
export function ResourceServicesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {SERVICES.map((service) => (
        <ResourceServicesCard key={service.title} {...service} />
      ))}
    </div>
  )
}
