import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type MetricStripProps = React.ComponentProps<"div"> & {
  columns?: 2 | 3 | 4
  surface?: "plain" | "card"
}

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
}

export function MetricStrip({
  columns = 3,
  surface = "card",
  className,
  ...props
}: MetricStripProps) {
  return (
    <div
      data-ui-pattern="metric-strip"
      className={cn(
        "grid grid-cols-1 overflow-hidden",
        columnClasses[columns],
        surface === "card"
          ? "gap-px rounded-xl border bg-border [&>*]:bg-card"
          : "gap-4",
        className
      )}
      {...props}
    />
  )
}

export type MetricStripItemProps = React.ComponentProps<"div"> & {
  label: React.ReactNode
  value: React.ReactNode
  detail?: React.ReactNode
  icon?: React.ReactNode
}

export function MetricStripItem({
  label,
  value,
  detail,
  icon,
  className,
  ...props
}: MetricStripItemProps) {
  return (
    <div
      data-ui-pattern="metric-strip-item"
      className={cn("flex min-w-0 items-center gap-4 p-5", className)}
      {...props}
    >
      {icon ? (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <div className="font-heading text-xl font-semibold tracking-tight tabular-nums">
          {value}
        </div>
        <div className="text-sm font-medium">{label}</div>
        {detail ? (
          <div className="mt-0.5 text-xs text-muted-foreground">{detail}</div>
        ) : null}
      </div>
    </div>
  )
}
