"use client"

import { ErrorState } from "@shurokkha/ui-patterns/feedback"

export type AppRouteErrorProps = {
  error?: Error & { digest?: string }
  reset: () => void
}

export function AppRouteError({ error, reset }: AppRouteErrorProps) {
  return (
    <ErrorState
      title="Workspace unavailable"
      description="This workspace could not be loaded. Retry the request; your navigation and shell remain available."
      errorCode={error?.digest}
      onRetry={reset}
    />
  )
}
