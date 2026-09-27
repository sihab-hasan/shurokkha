import { Card, CardContent, CardHeader } from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

const SKELETON_COUNT = 6

/**
 * Suspense fallback for {@link DisastersSection}. Mirrors the
 * three-column grid dimensions of {@link DisasterGrid} so the layout
 * doesn't jump when data hydrates.
 */
export function DisastersSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
