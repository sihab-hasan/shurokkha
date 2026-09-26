import { Skeleton } from "@shurokkha/ui/components/skeleton"

/**
 * Static fallback rendered inside the Suspense boundary while the
 * profile client island hydrates. Pure markup — no data fetching.
 */
export function ProfileSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading profile"
    >
      {/* Identity section */}
      <div className="space-y-4">
        <div className="space-y-2 pb-3">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Account section */}
      <div className="space-y-4">
        <div className="space-y-2 pb-3">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>

      {/* Related section */}
      <div className="space-y-4">
        <div className="space-y-2 pb-3">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="rounded-xl border bg-card">
          <div className="flex items-center gap-3 px-6 py-4">
            <Skeleton className="size-8 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="size-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
