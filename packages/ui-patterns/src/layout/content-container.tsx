import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

import {
  contentPaddingClass,
  contentWidthClass,
  type ContentPadding,
  type ContentWidth,
} from "./layout-tokens"

export type ContentContainerProps = React.ComponentProps<"div"> & {
  size?: ContentWidth
  padding?: ContentPadding
  padded?: boolean
}

export function ContentContainer({
  size = "default",
  padding = "default",
  padded = true,
  className,
  ...props
}: ContentContainerProps) {
  return (
    <div
      data-ui-pattern="content-container"
      className={cn(
        "mx-auto w-full min-w-0",
        contentWidthClass[size],
        padded && contentPaddingClass[padding],
        className
      )}
      {...props}
    />
  )
}
