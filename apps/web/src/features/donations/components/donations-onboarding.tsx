import Link from "next/link"
import { ClipboardList, Heart, Plus, ShieldCheck } from "lucide-react"

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
    title: "Choose a campaign",
    description:
      "Pick a disaster, zakat, sadaqah, or general fund to contribute to. You can target a specific campaign or give to the general relief pool.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Pay your way",
    description:
      "bKash, Nagad, Rocket, bank transfer, or card — whichever works for you. We issue a unique receipt number for every contribution.",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: "Follow the impact",
    description:
      "Track every donation here, from submission to confirmation. See exactly where your money went and what relief it bought.",
  },
]

/**
 * Onboarding empty state shown to first-time donors (no donations yet).
 * Replaces the standard empty list with an explanatory 3-step "how it
 * works" panel and a single primary call-to-action. Once the user
 * makes their first donation, this never appears again.
 */
export function DonationsOnboarding() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="grid gap-8 p-8 sm:p-10 md:grid-cols-[1fr_minmax(0,1.2fr)]">
        {/* Left: intro + CTA */}
        <div className="flex flex-col justify-center gap-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-info/10 px-3 py-1 text-xs font-medium text-info">
            <Heart className="h-3.5 w-3.5" />
            You haven&apos;t donated yet
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              How Shurokkha donations work
            </h2>
            <p className="text-sm text-muted-foreground">
              Every contribution goes through our coordination team, who match
              it to verified relief operations across the country. You get a
              unique receipt for every donation.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              nativeButton={false}
              render={<Link href={routes.public.donate} />}
            >
              <Plus /> Make a donation
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
