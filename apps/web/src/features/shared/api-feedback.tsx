import * as React from "react"
import type { ValidationIssue } from "@shurokkha/ui/components/misc"

export function errorMessage(error: unknown, fallback = "Action failed.") {
  if (!error) return fallback
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return fallback
}

type IssueInput =
  null | string | { id?: string; field?: string; message?: string }

export function issuesFromError(error: unknown): ValidationIssue[] {
  if (!error || typeof error !== "object") return []
  const candidates =
    (error as { issues?: unknown; errors?: unknown }).issues ??
    (error as { issues?: unknown; errors?: unknown }).errors
  if (!Array.isArray(candidates)) return []
  return candidates
    .map((item, index): IssueInput => {
      if (!item) return null
      if (typeof item === "string") return item
      if (typeof item === "object" && "message" in item) {
        const source = item as {
          field?: string
          id?: string
          message?: string
        }
        return {
          id: String(source.field ?? source.id ?? `err-${index}`),
          message: String(source.message ?? "Invalid value"),
        }
      }
      return null
    })
    .filter((v): v is string | { id: string; message: string } => v !== null)
    .map((v): ValidationIssue =>
      typeof v === "string" ? { id: `err-${v.slice(0, 16)}`, message: v } : v
    )
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
