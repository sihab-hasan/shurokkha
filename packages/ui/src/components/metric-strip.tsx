import * as React from "react"
import { cn } from "../lib/utils"

export const MetricStrip = ({
  children,
  columns = 4,
  className,
  ...props
}: any) => (
  <div
    className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
    {...props}
  >
    {children}
  </div>
)

export const MetricStripItem = ({
  title,
  label,
  value,
  detail,
  icon,
  trend,
  className,
  ...props
}: any) => (
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
            trend.positive ? "text-green-500" : "text-destructive"
          )}
        >
          {trend.value > 0 ? "+" : ""}
          {trend.value}% {trend.label}
        </p>
      )}
    </div>
  </div>
)

export const KpiCard = MetricStripItem
