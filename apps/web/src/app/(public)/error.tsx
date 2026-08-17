"use client"

import { ErrorState } from "@shurokkha/ui-patterns/feedback"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ContentContainer className="py-12">
      <ErrorState
        title="Page unavailable"
        description="This public page could not be loaded. Retry without leaving the Shurokkha site shell."
        errorCode={error.digest}
        onRetry={reset}
      />
    </ContentContainer>
  )
}
