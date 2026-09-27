import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"
import { SectionHeader } from "@shurokkha/ui/layout/section-header"

/**
 * "Get involved" panel: 2-up grid linking into the volunteer flow and
 * the donate flow. Static content but isolated as a feature component
 * so the home page composition stays clean.
 */
export function HomeGetInvolved() {
  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Get involved"
        title="Volunteer and donate"
        description="Verified contributions, matched to need. Track everything from your account."
        align="left"
        className="mb-0"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium">Volunteer with Shurokkha</p>
              <p className="text-sm leading-6 text-muted-foreground">
                Apply to be matched against verified assignments in your area
                or remotely.
              </p>
            </div>
            <Button nativeButton={false} render={<Link href="/volunteers" />}>
              Open
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium">Donate to relief</p>
              <p className="text-sm leading-6 text-muted-foreground">
                Pick a verified campaign or give to the general relief pool.
                Receipt generated immediately.
              </p>
            </div>
            <Button nativeButton={false} render={<Link href="/donate" />}>
              Donate
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
