import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type StatusBannerTone =
  "neutral" | "info" | "success" | "warning" | "critical"

export type StatusBannerProps = Omit<React.ComponentProps<"div">, "title"> & {
  tone?: StatusBannerTone
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  metadata?: React.ReactNode
  action?: React.ReactNode
}

const toneClasses: Record<StatusBannerTone, string> = {
  neutral: "border-border bg-card",
  info: "border-info/30 bg-info/5",
  success: "border-success/30 bg-success/5",
  warning: "border-warning/35 bg-warning/5",
  critical: "border-danger/35 bg-danger/5",
}

const iconClasses: Record<StatusBannerTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  critical: "bg-danger/10 text-danger",
}

export function StatusBanner({
  tone = "neutral",
  icon,
  title,
  description,
  metadata,
  action,
  className,
  role,
  ...props
}: StatusBannerProps) {
  return (
    <div
      data-ui-pattern="status-banner"
      data-tone={tone}
      role={role ?? (tone === "critical" ? "alert" : "status")}
      className={cn(
        "flex flex-col gap-4 rounded-lg border px-4 py-4 sm:flex-row sm:items-center sm:px-5",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5",
            iconClasses[tone]
          )}
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="leading-snug font-semibold">{title}</div>
        {description ? (
          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </div>
        ) : null}
        {metadata ? (
          <div className="mt-2 text-xs text-muted-foreground">{metadata}</div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
