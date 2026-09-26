import { Skeleton } from "@shurokkha/ui/components/skeleton"

/**
 * Static fallback rendered inside the Suspense boundary while the
 * client island hydrates. Pure markup — no data fetching.
 */
export function DonationsSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading donations"
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border bg-card text-card-foreground shadow-sm"
          >
            <div className="space-y-3 p-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_10rem_10rem]">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>

      {/* List */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="space-y-2 p-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end">
        <Skeleton className="h-9 w-48" />
      </div>
    </div>
  )
}
