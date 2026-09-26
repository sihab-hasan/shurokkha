import type { ComponentProps, ReactNode } from "react"

import { cn } from "../lib/utils"

export type SectionSpacing = "sm" | "md" | "lg" | "none"

export type SectionProps = ComponentProps<"section"> & {
  spacing?: SectionSpacing
  title?: ReactNode
  description?: ReactNode
}

const spacingClasses: Record<SectionSpacing, string> = {
  none: "py-0",
  sm: "py-6 sm:py-8 lg:py-10",
  md: "py-8 sm:py-12 lg:py-16",
  lg: "py-12 sm:py-16 lg:py-24",
}

export function Section({
  children,
  className,
  spacing = "md",
  title,
  description,
  ...props
}: SectionProps) {
  return (
    <section className={cn(spacingClasses[spacing], className)} {...props}>
      {(title || description) && (
        <div className="mb-6 space-y-1">
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
