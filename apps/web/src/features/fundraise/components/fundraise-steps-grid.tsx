import { HeartHandshake, Megaphone, ShieldCheck } from "lucide-react"

import { FundraiseStepCard } from "./fundraise-step-card"

const STEPS = [
  {
    title: "Choose a verified campaign",
    description:
      "Browse the active relief campaigns surfaced on the donate page. Pick the situation, region, or recovery focus that matters to you.",
    icon: HeartHandshake,
  },
  {
    title: "Share responsibly",
    description:
      "Use the campaign’s verified share assets. Shurokkha discourages speculative fundraising; only campaigns routed through the coordination team are promoted.",
    icon: Megaphone,
  },
  {
    title: "Track the impact",
    description:
      "Every donation gets a receipt. Donations are routed by the coordination team with public status updates and downstream allocation records.",
    icon: ShieldCheck,
  },
] as const

/**
 * 3-up grid of `FundraiseStepCard`s explaining the responsible-giving flow
 * on `/fundraise`.
 */
export function FundraiseStepsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {STEPS.map((step) => (
        <FundraiseStepCard key={step.title} {...step} />
      ))}
    </div>
  )
}
