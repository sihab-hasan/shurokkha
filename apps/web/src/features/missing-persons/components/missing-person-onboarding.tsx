import Link from "next/link"
import { AlertTriangle, Plus, ShieldCheck, Users } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"

import { routes } from "@/config/routes"

interface Step {
  icon: React.ReactNode
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    icon: <Plus className="h-5 w-5" />,
    title: "File a report",
    description:
      "Share the person's name, last seen location and time, and a photo if you have one. The more detail, the faster teams can act.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Verification",
    description:
      "Our coordination team verifies the report, cross-references with field data, and escalates to search teams.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Found or closed",
    description:
      "Once the person is located, the report is marked located and shared with you. Otherwise it stays active until resolved.",
  },
]

/**
 * Onboarding empty state shown to first-time users (no reports filed yet).
 * Replaces the standard empty list with an explanatory 3-step panel and a
 * single primary call-to-action. Disappears once the first report is filed.
 */
export function MissingPersonOnboarding() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="grid gap-8 p-8 sm:p-10 md:grid-cols-[1fr_minmax(0,1.2fr)]">
        {/* Left: intro + CTA */}
        <div className="flex flex-col justify-center gap-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-info/10 px-3 py-1 text-xs font-medium text-info">
            <AlertTriangle className="h-3.5 w-3.5" />
            You haven&apos;t filed a report yet
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              How missing-person reports work
            </h2>
            <p className="text-sm text-muted-foreground">
              Filing a report alerts our coordination team and on-ground search
              volunteers. Every report is tracked here until the person is
              located or the case is closed.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              nativeButton={false}
              render={<Link href={routes.account.createMissingPerson} />}
            >
              <Plus /> Create report
            </Button>
            <Button
              type="button"
              variant="ghost"
              nativeButton={false}
              render={
                <Link
                  href={routes.public.howItWorks}
                  aria-label="Learn more about how Shurokkha works"
                />
              }
              className="text-muted-foreground"
            >
              Learn more
            </Button>
          </div>
        </div>

        {/* Right: 3-step flow */}
        <ol className="space-y-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex items-start gap-4 rounded-lg border bg-background/50 p-4"
            >
              <div className="flex shrink-0 items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                >
                  {index + 1}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  {step.icon}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-medium">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
