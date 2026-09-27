import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { Card, CardContent } from "@shurokkha/ui/components/card"

/**
 * Preparedness callout rendered after the disaster grid on
 * `/disasters`. Encourages visitors to review the verified emergency
 * guides, and reminds them that Shurokkha is coordination, not a
 * replacement for emergency services.
 */
export function DisastersPreparednessCallout() {
  return (
    <Card className="bg-muted/30">
      <CardContent className="flex items-start gap-3 p-6">
        <ShieldAlert
          className="mt-0.5 size-5 shrink-0 text-primary"
          aria-hidden
        />
        <div className="space-y-1">
          <p className="text-sm font-medium">Preparedness</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Review verified emergency guidance and response steps at{" "}
            <Link
              className="font-medium text-foreground underline-offset-4 hover:underline"
              href="/resources/guides"
            >
              Emergency Guides
            </Link>{" "}
            before conditions worsen. Shurokkha is coordination, not a
            replacement for local emergency services.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
