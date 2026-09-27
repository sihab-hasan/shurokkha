import { LifeBuoy, PackageCheck } from "lucide-react"

import { Card, CardContent } from "@shurokkha/ui/components/card"

/**
 * Closing callout on `/resources/guides` directing visitors to the
 * help flow for live support and surfacing the "Verified" trust pill.
 */
export function GuidesSupportCallout() {
  return (
    <Card className="bg-muted/35">
      <CardContent className="flex flex-wrap items-center gap-3 p-6">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LifeBuoy className="size-5" aria-hidden />
        </span>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">Need live support?</p>
          <p className="text-sm leading-6 text-muted-foreground">
            For verified assistance requests, use the help flow. For urgent
            dangers, contact emergency services directly.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-xs font-medium">
            <PackageCheck className="size-3.5" />
            Verified
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
