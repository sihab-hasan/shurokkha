"use client"

import { ErrorState } from "@shurokkha/ui-patterns/feedback"

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      title="Workspace unavailable"
      description="The admin module failed to load. Retry without leaving the command center shell."
      errorCode={error.digest}
      onRetry={reset}
    />
  )
}
