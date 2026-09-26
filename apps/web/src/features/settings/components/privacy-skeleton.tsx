import { Skeleton } from "@shurokkha/ui/components/skeleton"

/**
 * Static fallback rendered inside the Suspense boundary while the
 * privacy client island hydrates. Pure markup — no data fetching.
 */
export function PrivacySkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading privacy preferences"
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-4">
          <div className="space-y-2 pb-3">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-9 w-48" />
            </div>
          </div>
        </div>
      ))}

      {/* Danger zone */}
      <div className="space-y-4">
        <div className="space-y-2 pb-3">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="grid gap-px rounded-xl border bg-border/60">
          {[0, 1].map((i) => (
            <div key={i} className="bg-card">
              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-72" />
                </div>
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
