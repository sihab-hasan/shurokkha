"use client"

import { AppRouteError } from "@/components/app/app-route-error"

export default function RoleAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <AppRouteError error={error} reset={reset} />
}
