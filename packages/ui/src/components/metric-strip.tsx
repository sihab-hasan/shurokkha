import * as React from "react"
import { cn } from "../lib/utils"

type MetricStripProps = React.HTMLAttributes<HTMLDivElement> & {
  columns?: 2 | 3 | 4
}

export const MetricStrip = ({
  children,
  className,
  ...props
}: MetricStripProps) => (
  <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)} {...props}>
    {children}
  </div>
)

type MetricStripItemProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode
  label?: React.ReactNode
  value?: React.ReactNode
  detail?: React.ReactNode
  icon?: React.ReactNode
  trend?: {
    value: number | string
    direction?: "up" | "down" | "neutral"
    label?: React.ReactNode
    positive?: boolean
  }
}

export const MetricStripItem = ({
  title,
  label,
  value,
  detail,
  icon,
  trend,
  className,
  ...props
}: MetricStripItemProps) => (
  <div
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  >
    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
      <h3 className="text-sm font-medium tracking-tight">{title || label}</h3>
      {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
    </div>
    <div className="p-6 pt-0">
      <div className="text-2xl font-bold">{value}</div>
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
      {trend && (
        <p
          className={cn(
            "text-xs",
            trend.positive || trend.direction === "up"
              ? "text-green-500"
              : trend.direction === "neutral"
                ? "text-muted-foreground"
                : "text-destructive"
          )}
        >
          {trend.value} {trend.label}
        </p>
      )}
    </div>
  </div>
)

export const KpiCard = MetricStripItem
