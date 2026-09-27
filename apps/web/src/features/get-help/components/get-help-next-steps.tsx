import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
} from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

const NEXT_STEPS = [
  {
    title: "We log the request against your account",
    description:
      "Shurokkha keeps a record of who asked, what they asked for, and where, so the coordination team can follow up with a consistent status.",
    icon: ClipboardList,
  },
  {
    title: "Coordination team reviews urgency and area context",
    description:
      "Verified requests are reviewed against the affected area, shelter capacity, active disasters, and current rescue team availability.",
    icon: CheckCircle2,
  },
  {
    title: "You can track status from your account",
    description:
      "Open your account dashboard any time to see whether the request is pending, in progress, resolved, or needs more information.",
    icon: ArrowRight,
  },
] as const

/**
 * "What happens next" panel: 3-step explainer for the request lifecycle.
 * Each step is rendered as a single-purpose card so the grid stays
 * scannable on small screens.
 */
export function GetHelpNextSteps() {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        What happens next
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {NEXT_STEPS.map(({ title, description, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="space-y-2">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="leading-6">
                {description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
