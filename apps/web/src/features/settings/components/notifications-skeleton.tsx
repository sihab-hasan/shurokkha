import { Skeleton } from "@shurokkha/ui/components/skeleton"

/**
 * Static fallback rendered inside the Suspense boundary while the
 * notifications client island hydrates. Pure markup — no data fetching.
 */
export function NotificationsSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading notification preferences"
    >
      {/* Delivery */}
      <div className="space-y-4">
        <div className="space-y-2 pb-3">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="rounded-xl border bg-card">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="size-9 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="space-y-4">
        <div className="space-y-2 pb-3">
          <Skeleton className="h-3.5 w-12" />
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="size-7 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="space-y-4">
        <div className="space-y-2 pb-3">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-9 w-48" />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border/60 px-6 py-4">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
