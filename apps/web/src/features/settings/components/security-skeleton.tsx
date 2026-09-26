import { Skeleton } from "@shurokkha/ui/components/skeleton"

/**
 * Static fallback rendered inside the Suspense boundary while the
 * security client island hydrates. Pure markup — no data fetching.
 */
export function SecuritySkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading security settings"
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-4">
          <div className="space-y-2 pb-3">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="rounded-xl border bg-card">
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-9 w-56" />
              </div>
            ))}
            <div className="flex items-center justify-end border-t border-border/60 px-6 py-3">
              <Skeleton className="h-8 w-36" />
            </div>
          </div>
        </div>
      ))}
      <div className="space-y-4">
        <div className="space-y-2 pb-3">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="divide-y divide-border/60 rounded-xl border bg-card">
          {[0, 1, 2, 3].map((j) => (
            <div key={j} className="flex items-center gap-3 px-6 py-3">
              <Skeleton className="size-8 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="size-6 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
