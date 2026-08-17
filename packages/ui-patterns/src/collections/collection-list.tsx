import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type CollectionListProps = React.ComponentProps<"ul"> & {
  divided?: boolean
}

export function CollectionList({
  divided = true,
  className,
  ...props
}: CollectionListProps) {
  return (
    <ul
      data-ui-pattern="collection-list"
      className={cn("min-w-0", divided && "divide-y divide-border", className)}
      {...props}
    />
  )
}
