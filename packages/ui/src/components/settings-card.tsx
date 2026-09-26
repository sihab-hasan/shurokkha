import * as React from "react"

import { cn } from "../lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card"

/**
 * A reusable card shell for the settings pages. Composes the standard
 * `Card` with a header (title + optional description + optional actions
 * slot) and a content area. Pages stack 1–N of these inside a
 * `Container`.
 *
 * Tone:
 * - `default` — hairline border, no shadow
 * - `danger` — destructive-tinted border + faint background; use for
 *   delete/sign-out cards
 *
 * Size:
 * - `default` — `--card-spacing` of `--spacing(6)` (24 px)
 * - `sm` — `--card-spacing` of `--spacing(4)` (16 px); tighter rows for
 *   settings grids
 */
export interface SettingsCardProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  /**
   * Card header title. Optional — when used with `flush` and no header (for
   * example an edge-to-edge list of rows), the title/description/actions
   * header is omitted entirely.
   */
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  /** Removes the default Card padding around the body. Useful when the
   * content is a list of rows that need to bleed to the card edges. */
  flush?: boolean
  /** Card density. `sm` produces tighter rows; `default` matches the
   * rest of the app's surface. */
  size?: "default" | "sm"
  /** Visual emphasis. `danger` paints a destructive-tinted border and a
   * faint destructive background — reserve for irreversible actions. */
  tone?: "default" | "danger"
  className?: string
  children?: React.ReactNode
}

export function SettingsCard({
  title,
  description,
  actions,
  flush = false,
  size = "default",
  tone = "default",
  className,
  children,
  ...rest
}: SettingsCardProps) {
  const hasHeader =
    title !== undefined || description !== undefined || actions !== undefined

  return (
    <Card
      size={size}
      className={cn(
        tone === "danger" &&
          "border-destructive/30 bg-destructive/5 dark:bg-destructive/10",
        className
      )}
      {...rest}
    >
      {hasHeader ? (
        <CardHeader>
          <div className="space-y-1.5">
            {title !== undefined ? <CardTitle>{title}</CardTitle> : null}
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {actions ? <CardAction>{actions}</CardAction> : null}
        </CardHeader>
      ) : null}
      <CardContent
        className={cn(
          flush && "px-0",
          // When the body is empty we don't want the trailing gap.
          !children && "hidden"
        )}
      >
        {children}
      </CardContent>
    </Card>
  )
}
