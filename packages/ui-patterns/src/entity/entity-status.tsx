import * as React from "react"
import { Badge } from "@shurokkha/ui/components/badge"
import { cn } from "@shurokkha/ui/lib/utils"

export type EntityStatusTone =
  "neutral" | "info" | "success" | "warning" | "danger"

export type EntityStatusProps = React.ComponentProps<typeof Badge> & {
  tone?: EntityStatusTone
  dot?: boolean
}

const toneClasses: Record<EntityStatusTone, string> = {
  neutral: "border-border bg-muted text-foreground",
  info: "border-info/20 bg-info/10 text-info",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  danger: "border-danger/20 bg-danger/10 text-danger",
}

const dotClasses: Record<EntityStatusTone, string> = {
  neutral: "bg-muted-foreground",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
}

export function EntityStatus({
  tone = "neutral",
  dot = true,
  className,
  children,
  ...props
}: EntityStatusProps) {
  return (
    <Badge
      variant="outline"
      className={cn("h-6 rounded-full px-2.5", toneClasses[tone], className)}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", dotClasses[tone])}
        />
      ) : null}
      {children}
    </Badge>
  )
}
