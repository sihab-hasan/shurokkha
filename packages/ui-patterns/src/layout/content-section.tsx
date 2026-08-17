import * as React from "react"

import { cn } from "@shurokkha/ui/lib/utils"
import { Separator } from "@shurokkha/ui/components/separator"

import { SectionHeader } from "../navigation/section-header"

export type ContentSectionProps = React.ComponentProps<"section"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  divided?: boolean
}

/**
 * Compact application/documentation content section.
 * Uses the shared SectionHeader typography so section headings do not drift.
 */
export function ContentSection({
  title,
  description,
  actions,
  divided = false,
  className,
  children,
  ...props
}: ContentSectionProps) {
  return (
    <section
      data-ui-pattern="content-section"
      className={cn("space-y-4", className)}
      {...props}
    >
      {title ? (
        <SectionHeader
          title={title}
          description={description}
          actions={actions}
          align="left"
          size="sm"
          className="mb-0 max-w-none"
        />
      ) : description || actions ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {description ? (
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : (
            <span />
          )}
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
      {divided ? <Separator /> : null}
      <div className="min-w-0">{children}</div>
    </section>
  )
}
