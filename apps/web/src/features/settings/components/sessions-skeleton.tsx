import { Skeleton } from "@shurokkha/ui/components/skeleton"

/**
 * Static fallback rendered inside the Suspense boundary while the
 * sessions client island hydrates. Pure markup — no data fetching.
 */
export function SessionsSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading sessions"
    >
      {/* Current device */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-6 pb-3">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-3.5 w-28" />
        </div>
        <div className="divide-y divide-border/60 rounded-xl border bg-card">
          <div className="flex items-center gap-3 px-6 py-3">
            <Skeleton className="size-8 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="size-6 rounded-full" />
          </div>
        </div>
      </div>

      {/* All active sessions */}
      <div className="space-y-4">
        <div className="space-y-2 pb-3">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="divide-y divide-border/60 rounded-xl border bg-card">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-3">
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

      {/* Sign-out-everywhere danger card */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-6 pb-3">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
