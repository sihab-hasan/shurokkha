import type { ComponentProps, ReactNode } from "react"

import { cn } from "../lib/utils"

export type SectionHeaderProps = Omit<ComponentProps<"header">, "title"> & {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** @deprecated Prefer description for new code. */
  subtitle?: ReactNode
  align?: "left" | "center"
  size?: "sm" | "default" | "lg"
  actions?: ReactNode
}

/**
 * Canonical nested-section heading for Web and Admin content.
 * Route identity belongs to PageHeader; use SectionHeader for content regions below it.
 */
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
      data-ui="section-header"
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
