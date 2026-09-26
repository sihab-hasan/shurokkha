import type { ComponentProps } from "react"

import { cn } from "../lib/utils"

export type GridColsCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type ResponsiveCols = {
  default?: GridColsCount
  sm?: GridColsCount
  md?: GridColsCount
  lg?: GridColsCount
  xl?: GridColsCount
  "2xl"?: GridColsCount
}

export type GridGap = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

export type GridProps = ComponentProps<"div"> & {
  cols?: GridColsCount | ResponsiveCols
  gap?: GridGap
  autoFit?: boolean
  minItemWidth?: string
}

const gapClasses: Record<GridGap, string> = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-10",
  "2xl": "gap-12",
}

const colClasses: Record<GridColsCount, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
}

const smColClasses: Record<GridColsCount, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
  7: "sm:grid-cols-7",
  8: "sm:grid-cols-8",
  9: "sm:grid-cols-9",
  10: "sm:grid-cols-10",
  11: "sm:grid-cols-11",
  12: "sm:grid-cols-12",
}

const mdColClasses: Record<GridColsCount, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
  7: "md:grid-cols-7",
  8: "md:grid-cols-8",
  9: "md:grid-cols-9",
  10: "md:grid-cols-10",
  11: "md:grid-cols-11",
  12: "md:grid-cols-12",
}

const lgColClasses: Record<GridColsCount, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
  7: "lg:grid-cols-7",
  8: "lg:grid-cols-8",
  9: "lg:grid-cols-9",
  10: "lg:grid-cols-10",
  11: "lg:grid-cols-11",
  12: "lg:grid-cols-12",
}

const xlColClasses: Record<GridColsCount, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
  7: "xl:grid-cols-7",
  8: "xl:grid-cols-8",
  9: "xl:grid-cols-9",
  10: "xl:grid-cols-10",
  11: "xl:grid-cols-11",
  12: "xl:grid-cols-12",
}

const twoXlColClasses: Record<GridColsCount, string> = {
  1: "2xl:grid-cols-1",
  2: "2xl:grid-cols-2",
  3: "2xl:grid-cols-3",
  4: "2xl:grid-cols-4",
  5: "2xl:grid-cols-5",
  6: "2xl:grid-cols-6",
  7: "2xl:grid-cols-7",
  8: "2xl:grid-cols-8",
  9: "2xl:grid-cols-9",
  10: "2xl:grid-cols-10",
  11: "2xl:grid-cols-11",
  12: "2xl:grid-cols-12",
}

function resolveColClasses(
  cols: GridColsCount | ResponsiveCols | undefined
): string {
  if (typeof cols === "number") {
    return colClasses[cols]
  }
  if (typeof cols === "object") {
    return cn(
      cols.default && colClasses[cols.default],
      cols.sm && smColClasses[cols.sm],
      cols.md && mdColClasses[cols.md],
      cols.lg && lgColClasses[cols.lg],
      cols.xl && xlColClasses[cols.xl],
      cols["2xl"] && twoXlColClasses[cols["2xl"]]
    )
  }
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
}

/**
 * `Grid` is a responsive CSS Grid layout primitive.
 * Use it for event listings, card grids, dashboard stats, or photo galleries.
 */
export function Grid({
  children,
  className,
  cols,
  gap = "md",
  autoFit = false,
  minItemWidth = "260px",
  style,
  ...props
}: GridProps) {
  const autoFitStyle = autoFit
    ? {
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minItemWidth}, 100%), 1fr))`,
        ...style,
      }
    : style

  return (
    <div
      className={cn(
        "grid",
        gapClasses[gap],
        !autoFit && resolveColClasses(cols),
        className
      )}
      style={autoFitStyle}
      {...props}
    >
      {children}
    </div>
  )
}
