import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"

/**
 * Closing CTA banner on `/fundraise` routing to `/donate` for active
 * campaigns and `/transparency` for the fund-tracking policy.
 */
export function FundraiseCtaCard() {
  return (
    <Card className="bg-muted/35">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="max-w-2xl space-y-1">
          <p className="text-sm font-medium">Ready to give?</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Pick an active campaign or give to the general relief pool. A
            receipt is generated immediately and your account keeps a record
            you can revisit.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button nativeButton={false} render={<Link href="/donate" />}>
            Open donate
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/transparency" />}
          >
            How funds are tracked
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
