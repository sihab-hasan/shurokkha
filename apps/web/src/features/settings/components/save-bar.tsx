"use client"

import * as React from "react"

import { Button } from "@shurokkha/ui/components/button"

export interface SaveBarProps {
  /** Disabled when the form is pristine or while a save is in-flight. */
  disabled?: boolean
  loading?: boolean
  /** Visible label on the primary button (default "Save changes"). */
  label?: string
  onSave?: () => void
  /** Optional content rendered to the left of the save button (e.g. status). */
  left?: React.ReactNode
  className?: string
}

/**
 * Sticky bottom save bar — Linear/Vercel pattern. Floats above the form
 * footer with a hairline divider and backdrop blur. Use at the bottom of
 * any settings form whose save action is explicit (Profile, Notifications,
 * Privacy).
 */
export function SaveBar({
  disabled,
  loading,
  label = "Save changes",
  onSave,
  left,
  className,
}: SaveBarProps) {
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault()
      if (!disabled && !loading && onSave) onSave()
    }
  }

  return (
    <div
      role="region"
      aria-label="Save actions"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className={
        "sticky bottom-0 z-10 -mx-6 mt-6 flex items-center justify-between gap-4 border-t border-border/60 bg-background/80 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 " +
        (className ?? "")
      }
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {left}
      </div>
      <Button
        type="button"
        size="sm"
        onClick={onSave}
        disabled={disabled || loading}
      >
        {loading ? "Saving…" : label}
      </Button>
    </div>
  )
}
