import * as React from "react"

import { cn } from "@shurokkha/ui/lib/utils"

import { AuthHeader } from "./auth-header"

export type AuthStateTone = "neutral" | "success" | "warning" | "danger"

export type AuthStateProps = React.ComponentProps<"section"> & {
  icon?: React.ReactNode
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  tone?: AuthStateTone
  actions?: React.ReactNode
  children?: React.ReactNode
}

const toneClasses: Record<AuthStateTone, string> = {
  neutral: "border-border bg-muted/40 text-muted-foreground",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  danger: "border-danger/20 bg-danger/10 text-danger",
}

/** Reusable authentication outcome/status state. Application links remain app-owned. */
export function AuthState({
  icon,
  eyebrow,
  title,
  description,
  tone = "neutral",
  actions,
  children,
  className,
  ...props
}: AuthStateProps) {
  return (
    <section
      data-ui-pattern="auth-state"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="space-y-4">
        {icon ? (
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-xl border [&_svg]:size-5",
              toneClasses[tone]
            )}
          >
            {icon}
          </div>
        ) : null}
        <AuthHeader eyebrow={eyebrow} title={title} description={description} />
      </div>
      {children}
      {actions ? (
        <div className="flex flex-col gap-2 sm:flex-row">{actions}</div>
      ) : null}
    </section>
  )
}
