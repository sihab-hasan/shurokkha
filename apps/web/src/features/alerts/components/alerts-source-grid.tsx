import { Megaphone, RadioTower, Siren } from "lucide-react"

import { AlertSourceCard } from "./alert-source-card"

const OFFICIAL_SOURCES = [
  {
    title: "Bangladesh Meteorological Department",
    description:
      "Official weather, cyclone, flood, and river-port forecasts used by the coordination team to flag upcoming risks.",
    href: "https://live.bmd.gov.bd/",
    icon: RadioTower,
  },
  {
    title: "Disaster Management Information System",
    description:
      "Government-published situation updates, advisories, and impact summaries during declared disasters.",
    href: "https://modmr.gov.bd/",
    icon: Megaphone,
  },
  {
    title: "National emergency helplines",
    description:
      "999 for police, fire, and ambulance. 1090 for cyclone/weather information. 333 for government services.",
    href: "/contact",
    icon: Siren,
  },
] as const

/**
 * 3-up grid of `AlertSourceCard`s enumerating the official Bangladesh
 * information sources Shurokkha references when validating community alerts.
 */
export function AlertsSourceGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {OFFICIAL_SOURCES.map((source) => (
        <AlertSourceCard key={source.title} {...source} />
      ))}
    </div>
  )
}
