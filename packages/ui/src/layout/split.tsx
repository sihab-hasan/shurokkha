import type { ComponentProps, ReactNode } from "react"

import { cn } from "../lib/utils"

export type SplitRatio =
  "1:1" | "2:1" | "1:2" | "3:1" | "1:3" | "sidebar-left" | "sidebar-right"

export type SplitGap = "sm" | "md" | "lg" | "xl"

export type SplitProps = ComponentProps<"div"> & {
  primary: ReactNode
  secondary: ReactNode
  ratio?: SplitRatio
  gap?: SplitGap
  reverseOnMobile?: boolean
  align?: "start" | "center" | "stretch"
}

const gapClasses: Record<SplitGap, string> = {
  sm: "gap-4 lg:gap-6",
  md: "gap-6 lg:gap-8",
  lg: "gap-8 lg:gap-12",
  xl: "gap-10 lg:gap-16",
}

const ratioClasses: Record<SplitRatio, { primary: string; secondary: string }> =
  {
    "1:1": {
      primary: "lg:w-1/2",
      secondary: "lg:w-1/2",
    },
    "2:1": {
      primary: "lg:w-2/3",
      secondary: "lg:w-1/3",
    },
    "1:2": {
      primary: "lg:w-1/3",
      secondary: "lg:w-2/3",
    },
    "3:1": {
      primary: "lg:w-3/4",
      secondary: "lg:w-1/4",
    },
    "1:3": {
      primary: "lg:w-1/4",
      secondary: "lg:w-3/4",
    },
    "sidebar-left": {
      primary: "w-full lg:max-w-xs lg:flex-shrink-0",
      secondary: "flex-1 min-w-0",
    },
    "sidebar-right": {
      primary: "flex-1 min-w-0",
      secondary: "w-full lg:max-w-sm lg:flex-shrink-0",
    },
  }

/**
 * `Split` is a two-column responsive layout primitive.
 * Use it for checkout pages (form + summary), settings screens, or master-detail views.
 */
export function Split({
  primary,
  secondary,
  ratio = "2:1",
  gap = "lg",
  reverseOnMobile = false,
  align = "start",
  className,
  ...props
}: SplitProps) {
  const ratioConfig = ratioClasses[ratio]

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row",
        reverseOnMobile && "flex-col-reverse",
        align === "start" && "lg:items-start",
        align === "center" && "lg:items-center",
        align === "stretch" && "lg:items-stretch",
        gapClasses[gap],
        className
      )}
      {...props}
    >
      <div className={cn("w-full", ratioConfig.primary)}>{primary}</div>
      <div className={cn("w-full", ratioConfig.secondary)}>{secondary}</div>
    </div>
  )
}
