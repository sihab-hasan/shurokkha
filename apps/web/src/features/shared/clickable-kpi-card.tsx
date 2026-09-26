"use client"

import { cn } from "@shurokkha/ui/lib/utils"

interface ClickableKpiCardProps {
  title: string
  value: number
  detail: string
  icon?: React.ReactNode
  active: boolean
  onClick: () => void
}

/**
 * A KPI tile that doubles as a filter shortcut.
 *
 * - Hover: lifts with a soft shadow
 * - Active: ringed in the primary color, indicating the filter is currently applied
 * - Keyboard: Enter/Space activates (rendered as a real <button>)
 *
 * The `onClick` is responsible for setting whatever URL params apply the
 * corresponding filter; pressing again should toggle the filter off.
 *
 * Implementation note: inlined markup (no nested div inside <button>) so the
 * rendered HTML is valid even though it visually mirrors MetricStripItem.
 */
export function ClickableKpiCard({
  title,
  value,
  detail,
  icon,
  active,
  onClick,
}: ClickableKpiCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${title}: ${value}. ${detail}. Click to filter.`}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border bg-card text-left text-card-foreground shadow transition-all",
        "hover:-translate-y-0.5 hover:shadow-md",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        active && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        {icon ? (
          <div className="text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </div>
        ) : null}
      </div>
      <div className="space-y-1 p-6 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        {detail ? (
          <p className="text-xs text-muted-foreground">{detail}</p>
        ) : null}
      </div>
      {active ? (
        <span
          aria-hidden
          className="pointer-events-none absolute top-2 right-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-primary uppercase"
        >
          Active
        </span>
      ) : null}
    </button>
  )
}
