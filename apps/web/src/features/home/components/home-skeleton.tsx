import { Skeleton } from "@shurokkha/ui/components/skeleton"

/**
 * Full-page skeleton mirror of the home composition: one hero
 * placeholder, one 4-up stats row, two 3-up card rows. Used as the
 * `<Suspense fallback>` on the home page.
 */
export function HomeSkeleton() {
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-2/3" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>

      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
