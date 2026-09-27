import { Card, CardContent } from "@shurokkha/ui/components/card"

/**
 * Empty state for `/shelters`. Rendered when the filter narrows to
 * zero rows so the visitor sees a useful next-step prompt.
 */
export function SheltersEmptyState() {
  return (
    <Card>
      <CardContent className="space-y-2 p-6">
        <p className="text-sm font-medium">No shelters to show</p>
        <p className="text-sm text-muted-foreground">
          No shelters match the current filter. Try widening the selection
          or check back later.
        </p>
      </CardContent>
    </Card>
  )
}
