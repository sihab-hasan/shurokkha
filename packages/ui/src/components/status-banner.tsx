import * as React from "react"
import { cn } from "../lib/utils"

type StatusBannerProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "warning" | "error" | "success"
  tone?: string
  icon?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  metadata?: React.ReactNode
  action?: React.ReactNode
}

const variants: Record<string, string> = {
  default: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  error: "bg-destructive/10 text-destructive",
  success: "bg-green-500/10 text-green-700",
  info: "bg-primary/10 text-primary",
  danger: "bg-destructive/10 text-destructive",
  critical: "bg-destructive/10 text-destructive",
}

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
}: StatusBannerProps) => {
  const v = tone ?? variant
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md p-4 text-sm font-medium",
        variants[v] ?? variants.default,
        className
      )}
      {...props}
    >
      {icon && <div className="shrink-0 text-muted-foreground">{icon}</div>}
      <div className="flex-1 space-y-1">
        {(title || children) && (
          <div className="font-semibold">{title ?? children}</div>
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
