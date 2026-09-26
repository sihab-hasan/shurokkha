import Link from "next/link"
import {
  AlertTriangle,
  ClipboardList,
  Hourglass,
  Plus,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"

import { routes } from "@/config/routes"

interface Step {
  icon: React.ReactNode
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    icon: <ClipboardList className="h-5 w-5" />,
    title: "Submit a request",
    description:
      "Describe what you need — rescue, medical, essentials, shelter — and add an address or last known location.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "We verify and assign",
    description:
      "Our coordination team confirms the report and routes it to the right relief team for your area.",
  },
  {
    icon: <Hourglass className="h-5 w-5" />,
    title: "Track until resolved",
    description:
      "Follow the status of every request from submission to resolution right here in your account.",
  },
]

/**
 * Onboarding empty state shown to first-time users (no requests submitted yet).
 * Replaces the standard empty list with an explanatory 3-step "how it works"
 * panel and a single primary call-to-action. Once the user submits their
 * first request, this never appears again.
 */
export function AssistanceOnboarding() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="grid gap-8 p-8 sm:p-10 md:grid-cols-[1fr_minmax(0,1.2fr)]">
        {/* Left: intro + CTA */}
        <div className="flex flex-col justify-center gap-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-info/10 px-3 py-1 text-xs font-medium text-info">
            <AlertTriangle className="h-3.5 w-3.5" />
            You haven&apos;t submitted a request yet
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              How Shurokkha assistance works
            </h2>
            <p className="text-sm text-muted-foreground">
              We connect people in distress with verified relief teams across
              the country. Submit a request and our coordination team will take
              it from there.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              nativeButton={false}
              render={<Link href={routes.account.createAssistance} />}
            >
              <Plus /> Request help
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
