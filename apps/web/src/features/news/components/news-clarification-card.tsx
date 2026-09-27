import Link from "next/link"

import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"

/**
 * Closing card on `/news` pointing visitors at the live operational
 * surfaces (map, alerts) that back the news lens pages.
 */
export function NewsClarificationCard() {
  return (
    <Card className="bg-muted/35">
      <CardContent className="space-y-2 p-6">
        <p className="text-sm font-medium">
          Looking for live operational updates?
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          The Live response map and Disasters page surface the same data the
          news pages reference, refreshed as conditions change.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button nativeButton={false} size="sm" render={<Link href="/map" />}>
            Live response map
          </Button>
          <Button
            nativeButton={false}
            size="sm"
            variant="outline"
            render={<Link href="/emergency-alerts" />}
          >
            Verified alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
