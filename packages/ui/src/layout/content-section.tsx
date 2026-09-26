import type { ComponentProps, ReactNode } from "react"

import { Separator } from "../components/separator"
import { cn } from "../lib/utils"
import { SectionHeader } from "./section-header"

export type ContentSectionProps = ComponentProps<"section"> & {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  divided?: boolean
}

/**
 * Compact nested content region used inside a route-owned Section/Container.
 * This does not replace the route-level Section primitive.
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
      data-ui="content-section"
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
