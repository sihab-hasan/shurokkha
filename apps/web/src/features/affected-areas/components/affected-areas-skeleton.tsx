import { Skeleton } from "@shurokkha/ui/components/skeleton"

const SKELETON_COUNT = 3

/**
 * Suspense fallback for an affected-area column.
 */
export function AffectedAreasSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-full" />
      ))}
    </div>
  )
}
