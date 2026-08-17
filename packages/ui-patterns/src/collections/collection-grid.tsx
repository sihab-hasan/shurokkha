import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type CollectionGridProps = React.ComponentProps<"div"> & {
  columns?: 1 | 2 | 3 | 4
  dense?: boolean
}

const grids = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
}

export function CollectionGrid({
  columns = 3,
  dense = false,
  className,
  ...props
}: CollectionGridProps) {
  return (
    <div
      data-ui-pattern="collection-grid"
      className={cn(
        "grid",
        grids[columns],
        dense ? "gap-3" : "gap-5",
        className
      )}
      {...props}
    />
  )
}
