import * as React from "react"

import { cn } from "@shurokkha/ui/lib/utils"

export type SectionHeaderProps = Omit<
  React.ComponentProps<"header">,
  "title"
> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** @deprecated Prefer description for new code. */
  subtitle?: React.ReactNode
  align?: "left" | "center"
  size?: "sm" | "default" | "lg"
  actions?: React.ReactNode
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  subtitle,
  align = "center",
  size = "default",
  actions,
  className,
  ...props
}: SectionHeaderProps) {
  const supportingText = description ?? subtitle
  const titleSize = {
    sm: "text-lg sm:text-xl",
    default: "text-2xl sm:text-3xl",
    lg: "text-3xl sm:text-4xl lg:text-5xl",
  }[size]

  return (
    <header
      data-ui-pattern="section-header"
      className={cn(
        "mb-8 max-w-3xl space-y-3 sm:mb-10",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
      {...props}
    >
      {eyebrow ? (
        <div className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {eyebrow}
        </div>
      ) : null}
      <h2
        className={cn(
          "font-heading font-semibold tracking-tight text-balance text-foreground",
          titleSize
        )}
      >
        {title}
      </h2>
      {supportingText ? (
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          {supportingText}
        </p>
      ) : null}
      {actions ? (
        <div
          className={cn("pt-2", align === "center" && "flex justify-center")}
        >
          {actions}
        </div>
      ) : null}
    </header>
  )
}
