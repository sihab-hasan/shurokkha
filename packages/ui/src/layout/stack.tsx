import type { ComponentProps } from "react"

import { cn } from "../lib/utils"

export type StackGap = "sm" | "md" | "lg" | "xl"

export type StackProps = ComponentProps<"div"> & {
  gap?: StackGap
  direction?: "col" | "row"
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  justify?: "start" | "center" | "end" | "between"
  wrap?: boolean
}

const gapClasses: Record<StackGap, string> = {
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
}

export function Stack({
  children,
  className,
  align = "stretch",
  direction = "col",
  gap = "md",
  justify = "start",
  wrap = true,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        wrap && direction === "row" && "flex-wrap",
        gapClasses[gap],
        align === "start" && "items-start",
        align === "center" && "items-center",
        align === "end" && "items-end",
        align === "stretch" && "items-stretch",
        align === "baseline" && "items-baseline",
        justify === "start" && "justify-start",
        justify === "center" && "justify-center",
        justify === "end" && "justify-end",
        justify === "between" && "justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
