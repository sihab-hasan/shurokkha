import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"

/**
 * Closing banner on `/volunteers` addressed at existing volunteers,
 * pointing them at `/account/volunteering` for their missions and
 * hours.
 */
export function VolunteerExistingBanner() {
  return (
    <Card className="bg-muted/35">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="max-w-2xl space-y-1">
          <p className="text-sm font-medium">Already a volunteer?</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Sign in to see your missions, hours, and assignments in one place.
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/account/volunteering" />}
        >
          Open my missions
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  )
}
