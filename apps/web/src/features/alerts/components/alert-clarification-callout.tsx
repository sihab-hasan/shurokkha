import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"

/**
 * Muted callout clarifying that Shurokkha complements — not replaces —
 * official emergency services. Links into `/disasters` and `/map` so
 * visitors have a clear next step after reading the source grid.
 */
export function AlertClarificationCallout() {
  return (
    <Card className="bg-muted/35">
      <CardContent className="space-y-3 p-6">
        <p className="text-sm font-medium">
          Shurokkha does not replace official emergency services
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          When conditions change quickly, prefer information published by
          official Bangladesh agencies. Shurokkha&apos;s role is to coordinate
          support pathways and surface verified context — not to replace police,
          fire, ambulance, or civil defence response.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            nativeButton={false}
            size="sm"
            render={<Link href="/disasters" />}
          >
            See active disasters
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            nativeButton={false}
            size="sm"
            variant="outline"
            render={<Link href="/map" />}
          >
            Live response map
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
