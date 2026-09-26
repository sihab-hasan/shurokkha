import * as React from "react"
import type { ValidationIssue } from "@shurokkha/ui/components/misc"

export function errorMessage(error: unknown, fallback = "Action failed.") {
  if (!error) return fallback
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return fallback
}

export function issuesFromError(error: unknown): ValidationIssue[] {
  if (!error || typeof error !== "object") return []
  const candidates =
    (error as { issues?: unknown; errors?: unknown }).issues ??
    (error as { issues?: unknown; errors?: unknown }).errors
  if (!Array.isArray(candidates)) return []
  return candidates
    .map((item, index) => {
      if (!item) return null
      if (typeof item === "string") return { id: `err-${index}`, message: item }
      if (typeof item === "object" && "message" in item) {
        return {
          id: String(
            (item as { field?: string; id?: string }).field ??
              (item as { field?: string; id?: string }).id ??
              `err-${index}`
          ),
          message: String(
            (item as { message?: string }).message ?? "Invalid value"
          ),
        }
      }
      return null
    })
    .filter((v): v is ValidationIssue => v !== null)
}

export function ApiFailure({
  error,
  fallback = "An unexpected error occurred.",
}: {
  error: unknown
  fallback?: string
}) {
  if (!error) return null

  const message = errorMessage(error, fallback)

  return (
    <div className="dark:text-destructive-foreground rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger dark:border-destructive/40 dark:bg-destructive/20">
      <p className="font-semibold">Error</p>
      <p>{message}</p>
    </div>
  )
}
