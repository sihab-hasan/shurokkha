import type { LucideIcon } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@shurokkha/ui/components/empty"

export interface ComingSoonEmptyProps {
  icon: LucideIcon
  title: string
  description?: string
  /** Optional small badge or content shown below the description. */
  action?: React.ReactNode
  className?: string
}

/**
 * Thin wrapper around `<Empty>` for "ships in a future release" placeholders.
 * Used on Security (Login history) and Privacy (data export / delete account).
 */
export function ComingSoonEmpty({
  icon: Icon,
  title,
  description = "This ships in a future release. We'll let you know when it's ready.",
  action,
  className,
}: ComingSoonEmptyProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon aria-hidden />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action}
    </Empty>
  )
}
