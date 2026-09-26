import type { ComponentProps } from "react"

import { cn } from "../lib/utils"

export type ClusterGap = "xs" | "sm" | "md" | "lg" | "xl"

export type ClusterProps = ComponentProps<"div"> & {
  gap?: ClusterGap
  align?: "start" | "center" | "end" | "baseline" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
}

const gapClasses: Record<ClusterGap, string> = {
  xs: "gap-1.5",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
}

const alignClasses: Record<NonNullable<ClusterProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
}

const justifyClasses: Record<NonNullable<ClusterProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
}

/**
 * `Cluster` is a horizontal flex-wrap layout primitive.
 * Use it for tags, badge groups, button rows, or any set of items that should
 * flow inline and wrap gracefully when space runs out.
 */
export function Cluster({
  children,
  className,
  gap = "md",
  align = "center",
  justify = "start",
  ...props
}: ClusterProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap",
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
