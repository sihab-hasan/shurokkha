import Link from "next/link"
import { ArrowRight, MapPinned } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"

/**
 * Banner rendered at the top of `/map` to manage expectations about
 * the static placeholder visualization, while still surfacing a
 * working CTA into the underlying data sources.
 */
export function MapDataBanner() {
  return (
    <Card className="border-dashed bg-muted/25">
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <MapPinned
            className="size-5 shrink-0 text-primary"
            aria-hidden
          />
          <div className="space-y-0.5">
            <p className="text-sm font-medium">
              Interactive map coming soon
            </p>
            <p className="text-xs text-muted-foreground">
              Below is the same source data the map will plot, grouped by
              region so you can see where each piece connects.
            </p>
          </div>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<Link href="/disasters" />}
        >
          View disaster list
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  )
}
