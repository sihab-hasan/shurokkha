import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type NotificationItemProps = Omit<
  React.ComponentProps<"article">,
  "title"
> & {
  title: React.ReactNode
  description?: React.ReactNode
  timestamp?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  unread?: boolean
  metadata?: React.ReactNode
}

export function NotificationItem({
  title,
  description,
  timestamp,
  icon,
  action,
  unread = false,
  metadata,
  className,
  ...props
}: NotificationItemProps) {
  return (
    <article
      data-ui-pattern="notification-item"
      data-unread={unread || undefined}
      className={cn(
        "relative flex gap-3 px-4 py-4",
        unread && "bg-primary/[0.035]",
        className
      )}
      {...props}
    >
      {unread ? (
        <>
          <span className="sr-only">Unread</span>
          <span
            aria-hidden="true"
            className="absolute top-5 left-1.5 size-1.5 rounded-full bg-primary"
          />
        </>
      ) : null}
      {icon ? (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-4">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 text-sm font-medium">{title}</div>
          {timestamp ? (
            <div className="shrink-0 text-xs text-muted-foreground">
              {timestamp}
            </div>
          ) : null}
        </div>
        {description ? (
          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </div>
        ) : null}
        {metadata ? (
          <div className="mt-2 text-xs text-muted-foreground">{metadata}</div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </article>
  )
}
