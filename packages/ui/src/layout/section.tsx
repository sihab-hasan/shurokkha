import type { ComponentProps } from "react"

import { cn } from "../lib/utils"

export type SectionSpacing = "sm" | "md" | "lg" | "none"

export type SectionProps = ComponentProps<"section"> & {
  spacing?: SectionSpacing
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
  ...props
}: SectionProps) {
  return (
    <section className={cn(spacingClasses[spacing], className)} {...props}>
      {children}
    </section>
  )
}
