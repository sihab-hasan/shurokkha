"use client"

import { ErrorState } from "@shurokkha/ui-patterns/feedback"

export default function DocumentationError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      title="Documentation unavailable"
      description="This reference page could not be loaded. Retry while keeping the documentation navigation available."
      errorCode={error.digest}
      onRetry={reset}
    />
  )
}
