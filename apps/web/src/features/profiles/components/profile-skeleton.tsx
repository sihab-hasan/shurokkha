import { Card, CardContent, CardHeader } from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

interface ProfileSkeletonProps {
  username: string
}

/**
 * Suspense fallback for the public profile page. Mirrors the header
 * card + about card dimensions so the page doesn't reflow when
 * the data hydrates.
 */
export function ProfileSkeleton({ username }: ProfileSkeletonProps) {
  return (
    <div className="space-y-6">
      <Card className="gap-0 overflow-hidden py-0 shadow-xs">
        <Skeleton className="h-28 sm:h-40" />
        <CardHeader className="relative gap-3 px-5 pt-16 pb-4 sm:px-8 sm:pt-20">
          <Skeleton className="absolute -top-14 size-28 rounded-full ring-4 ring-background sm:-top-16 sm:size-32" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>
      </Card>
      <Skeleton className="h-48 w-full" />
      <p className="text-xs text-muted-foreground">Loading @{username}</p>
    </div>
  )
}
