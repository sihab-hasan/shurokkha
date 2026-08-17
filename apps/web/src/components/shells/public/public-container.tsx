import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { cn } from "@shurokkha/ui/lib/utils"

export interface PublicContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * Canonical public-shell width and gutters.
 * Header, public page content, and footer all align to the same 88rem grid.
 */
export function PublicContainer({ children, className }: PublicContainerProps) {
  return (
    <ContentContainer
      size="default"
      padded={false}
      className={cn("px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </ContentContainer>
  )
}
