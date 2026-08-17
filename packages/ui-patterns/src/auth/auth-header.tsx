import * as React from "react"

import { cn } from "@shurokkha/ui/lib/utils"

export type AuthHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  compact?: boolean
}

/** Heading pattern for authentication, recovery, and verification screens. */
export function AuthHeader({
  eyebrow,
  title,
  description,
  align = "left",
  compact = false,
  className,
  ...props
}: AuthHeaderProps) {
  return (
    <header
      data-ui-pattern="auth-header"
      className={cn(
        "space-y-2",
        align === "center" && "text-center",
        className
      )}
      {...props}
    >
      {eyebrow ? (
        <div className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {eyebrow}
        </div>
      ) : null}
      <h1
        className={cn(
          "font-heading font-semibold tracking-tight text-balance",
          compact ? "text-2xl" : "text-2xl sm:text-3xl"
        )}
      >
        {title}
      </h1>
      {description ? (
        <p className="text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
          {description}
        </p>
      ) : null}
    </header>
  )
}
