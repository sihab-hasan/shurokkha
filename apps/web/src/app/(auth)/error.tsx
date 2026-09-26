"use client"

import { TriangleAlert } from "lucide-react"

import { AuthState } from "@shurokkha/ui/components/misc"
import { Button } from "@shurokkha/ui/components/button"

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <AuthState
      role="alert"
      tone="danger"
      icon={<TriangleAlert />}
      title="Unable to continue"
      actions={<Button onClick={reset}>Try again</Button>}
    >
      {error.digest ? (
        <p className="text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      ) : null}
    </AuthState>
  )
}
