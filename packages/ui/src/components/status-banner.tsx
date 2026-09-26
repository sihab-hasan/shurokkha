import * as React from "react"
import { cn } from "../lib/utils"

export const StatusBanner = ({
  children,
  variant = "default",
  tone,
  icon,
  title,
  description,
  metadata,
  action,
  className,
  ...props
}: any) => {
  const v = tone || variant
  const variants = {
    default: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    error: "bg-destructive/10 text-destructive",
    success: "bg-green-500/10 text-green-700",
  } as Record<string, string>
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md p-4 text-sm font-medium",
        variants[v] || variants.default,
        className
      )}
      {...props}
    >
      {icon && <div className="shrink-0 text-muted-foreground">{icon}</div>}
      <div className="flex-1 space-y-1">
        {(title || children) && (
          <div className="font-semibold">{title || children}</div>
        )}
        {description && (
          <div className="text-muted-foreground">{description}</div>
        )}
        {metadata && (
          <div className="text-xs text-muted-foreground">{metadata}</div>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
