"use client"

export default function WorkspaceError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  void reset
  return null
}
