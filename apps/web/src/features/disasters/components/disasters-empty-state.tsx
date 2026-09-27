import { CircleDot } from "lucide-react"

import { Card, CardContent } from "@shurokkha/ui/components/card"

/**
 * Renders when the public disaster list returns zero rows. The copy
 * uses positive framing ("Nothing is currently flagged active") so the
 * empty state is informative rather than alarming.
 */
export function DisastersEmptyState() {
  return (
    <Card>
      <CardContent className="space-y-2 p-6">
        <div className="flex items-center gap-2">
          <CircleDot className="size-4 text-success" />
          <p className="text-sm font-medium">No active disasters</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Nothing is currently flagged active. Resolved and monitoring
          entries will appear here as they are reported.
        </p>
      </CardContent>
    </Card>
  )
}
