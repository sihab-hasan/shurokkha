import { Card, CardContent } from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

/**
 * Page-level skeleton for `/map`. Renders the banner slot, the
 * three-column region grid, and a trailing bar so the layout is
 * stable from first paint.
 */
export function MapSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-full" />
      <div className="grid gap-6 lg:grid-cols-3">
        {[0, 1, 2].map((column) => (
          <div key={column} className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Card>
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
