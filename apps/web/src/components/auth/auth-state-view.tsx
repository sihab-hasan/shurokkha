import Link from "next/link"

import { AuthState, type AuthStateTone } from "@shurokkha/ui-patterns/auth"
import { buttonVariants } from "@shurokkha/ui/components/button"
import { cn } from "@shurokkha/ui/lib/utils"

export interface AuthStateViewProps {
  icon: React.ElementType
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
  children?: React.ReactNode
  tone?: AuthStateTone
}

/** Web-specific auth state composition. Routing stays in the app; presentation stays in ui-patterns. */
export function AuthStateView({
  icon: Icon,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  children,
  tone = "neutral",
}: AuthStateViewProps) {
  return (
    <AuthState
      role="status"
      icon={<Icon aria-hidden="true" />}
      tone={tone}
      title={title}
      description={description}
      actions={
        <>
          <Link
            href={primaryHref}
            className={cn(buttonVariants({ size: "lg" }), "h-11 flex-1")}
          >
            {primaryLabel}
          </Link>
          {secondaryLabel && secondaryHref ? (
            <Link
              href={secondaryHref}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 flex-1"
              )}
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </>
      }
    >
      {children}
    </AuthState>
  )
}
