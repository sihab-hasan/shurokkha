import { Compass, Flame, HeartPulse, Home } from "lucide-react"

import { GuidePhaseCard } from "./guide-phase-card"

const PHASES = [
  {
    label: "Prepare",
    icon: Compass,
    summary:
      "Build a household emergency plan, identify safe rooms, and pre-pack a grab-bag for each family member.",
    bullets: [
      "Identify at least two evacuation routes from your home and workplace.",
      "Pre-pack water (3L per person per day), non-perishable food, medicine, ID copies, and a small first-aid kit.",
      "Save official helplines and the nearest shelter in your phone under speed-dial.",
      "Agree a family check-in contact who lives outside your area.",
    ],
  },
  {
    label: "Respond",
    icon: Flame,
    summary:
      "Stay informed through verified alerts, follow official instructions, and reach out through Shurokkha only when coordination adds value.",
    bullets: [
      "Move to higher ground or designated shelter when local authorities advise.",
      "Keep your phone charged and limit non-essential calls so emergency lines stay clear.",
      "Use verified alerts to confirm what you’re hearing — avoid rumours and unverified forwards.",
      "Submit a help request through Shurokkha only when you need coordination, not for general awareness.",
    ],
  },
  {
    label: "Evacuate",
    icon: Home,
    summary:
      "Move quickly, travel light, and make sure your household and pets are accounted for at the receiving shelter.",
    bullets: [
      "Turn off electricity, gas, and water before leaving if it’s safe to do so.",
      "Take your grab-bag, ID, and any medicines. Leave valuables behind.",
      "Register at the receiving shelter so the coordination team knows your household is safe.",
      "Keep children close and use the family check-in contact as soon as you can.",
    ],
  },
  {
    label: "Recover",
    icon: HeartPulse,
    summary:
      "Recovery is multi-week. Watch for verified updates, check on neighbours, and use Shurokkha’s transparency tools to follow how aid is being routed.",
    bullets: [
      "Use official guidance before returning home, drinking tap water, or using electrical systems.",
      "Track any donations you made through Shurokkha’s transparency page.",
      "Report missing or displaced people through the missing-persons flow in your account.",
      "Reach out for mental-health support if needed — recovery is not only physical.",
    ],
  },
]

/**
 * 2-column responsive grid of `GuidePhaseCard`s rendering all four
 * disaster-cycle phases on `/resources/guides`.
 */
export function GuidePhasesGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {PHASES.map((phase) => (
        <GuidePhaseCard key={phase.label} {...phase} />
      ))}
    </div>
  )
}
