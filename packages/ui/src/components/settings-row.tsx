import * as React from "react"

import { cn } from "../lib/utils"
import { Label } from "./label"

/**
 * A two-column settings row: label + optional description on the left,
 * a control on the right. The label becomes a real `<Label>` (with the
 * appropriate `htmlFor`) whenever `id` is set, so a Switch/Checkbox/
 * Input inside the `control` slot wires up correctly without any extra
 * plumbing.
 *
 * Use inside a `SettingsCard` (with `flush`) so the dividers line up.
 *
 * Optional `meta` slot appears as a small monospace line directly under
 * the description — useful for "Last edited 3 days ago" annotations.
 */
export interface SettingsRowProps {
  id?: string
  label: React.ReactNode
  description?: React.ReactNode
  /** Inline annotation directly under the description (e.g. timestamp). */
  meta?: React.ReactNode
  control: React.ReactNode
  className?: string
}

export function SettingsRow({
  id,
  label,
  description,
  meta,
  control,
  className,
}: SettingsRowProps) {
  const labelNode = id ? (
    <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
      {label}
    </Label>
  ) : (
    <span className="text-sm leading-none font-medium">{label}</span>
  )

  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        className
      )}
    >
      <div className="space-y-1 sm:max-w-[60%]">
        {labelNode}
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
        {meta ? (
          <p className="font-mono text-[11px] text-muted-foreground/70">
            {meta}
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-end gap-2">{control}</div>
    </div>
  )
}
