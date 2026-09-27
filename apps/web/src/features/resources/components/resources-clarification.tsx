import { Card, CardContent } from "@shurokkha/ui/components/card"

/**
 * Closing muted callout on `/resources` explaining the curation
 * principles (source transparency, accessibility, right level of
 * detail) behind the library.
 */
export function ResourcesClarification() {
  return (
    <Card className="bg-muted/35">
      <CardContent className="space-y-2 p-6">
        <p className="text-sm font-medium">Why these resources?</p>
        <p className="text-sm leading-6 text-muted-foreground">
          The library is curated against three principles: source
          transparency, accessibility, and the right level of detail for the
          moment someone is using it. Shurokkha avoids publishing information
          that hasn’t been verified against official guidance or coordination
          context.
        </p>
      </CardContent>
    </Card>
  )
}
