import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"

import { VolunteerOpportunityRow } from "./volunteer-opportunity-row"

const OPPORTUNITIES = [
  {
    title: "Shelter intake and welfare check-ins",
    location: "Across active shelters",
    commitment: "4-hour shifts",
    urgency: "Urgent" as const,
  },
  {
    title: "Relief distribution at supply hubs",
    location: "Distribution hubs in active disasters",
    commitment: "Half-day shifts",
    urgency: "Urgent" as const,
  },
  {
    title: "Translated outreach and helpline follow-up",
    location: "Remote",
    commitment: "2-hour shifts",
    urgency: "Ongoing" as const,
  },
  {
    title: "First-aid and welfare station support",
    location: "Welfare stations in active disasters",
    commitment: "Half-day shifts",
    urgency: "Ongoing" as const,
  },
]

/**
 * "Urgent opportunities" table on `/volunteers`. Shows a section header
 * with the apply CTA alongside a stacked list of `VolunteerOpportunityRow`s.
 */
export function VolunteerOpportunitiesTable() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Urgent opportunities
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Volunteer roles currently coordinated by the response team. Apply
            through your account to be matched against verified need.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/account/volunteering/application" />}
        >
          Apply to volunteer
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
      <Card>
        <CardContent className="grid gap-0 divide-y divide-border/70 p-0">
          {OPPORTUNITIES.map((row) => (
            <VolunteerOpportunityRow key={row.title} {...row} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
