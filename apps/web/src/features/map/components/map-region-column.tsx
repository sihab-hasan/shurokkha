import { Card, CardContent } from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

interface MapRegionColumnProps {
  title: string
  icon: React.ReactNode
  isPending: boolean
  isError: boolean
  emptyMessage: string
  errorMessage: string
  children: React.ReactNode
}

/**
 * Reusable region column for `/map`. Handles the four states
 * (pending / error / empty / populated) so the column aggregator
 * stays declarative. Children are rendered as-is when populated.
 */
export function MapRegionColumn({
  title,
  icon,
  isPending,
  isError,
  emptyMessage,
  errorMessage,
  children,
}: MapRegionColumnProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-heading text-base font-semibold">{title}</h2>
      </div>
      {isError ? (
        <Card>
          <CardContent className="p-4 text-xs text-muted-foreground">
            {errorMessage}
          </CardContent>
        </Card>
      ) : isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {Array.isArray(children) && children.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-xs text-muted-foreground">
                {emptyMessage}
              </CardContent>
            </Card>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  )
}
