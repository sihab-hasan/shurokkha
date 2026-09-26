import * as React from "react"

import { cn } from "../lib/utils"

/**
 * Linear/Vercel-style section header for settings pages. Renders as a
 * slim divider with an uppercase eyebrow (e.g. "DELIVERY"), a title,
 * an optional description, and an optional right-aligned metadata
 * or actions slot.
 *
 * Pages typically stack one or more of these between cards to give
 * longer settings pages visible structure (e.g. Notifications has
 * Delivery → Events → Schedule).
 */
export interface SettingsSectionProps {
  eyebrow?: string
  title: string
  description?: React.ReactNode
  /** Right-aligned annotation (e.g. "Edited 3 days ago" or a ⌘K hint). */
  metadata?: React.ReactNode
  /** Right-aligned action (e.g. a Save button or an Add link). */
  actions?: React.ReactNode
  className?: string
}

export function SettingsSection({
  eyebrow,
  title,
  description,
  metadata,
  actions,
  className,
}: SettingsSectionProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-between gap-6 border-b border-border/60 pb-3",
        className
      )}
    >
      <div className={cn("min-w-0", eyebrow ? "space-y-1" : "space-y-0.5")}>
        {eyebrow ? (
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-heading text-base leading-snug font-semibold tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="text-sm leading-snug text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {metadata || actions ? (
        <div className="flex shrink-0 items-center gap-3 font-mono text-xs text-muted-foreground">
          {metadata}
          {actions}
        </div>
      ) : null}
    </div>
  )
}
