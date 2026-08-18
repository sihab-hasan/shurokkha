"use client"

import Link from "next/link"

import { ApiError } from "@shurokkha/api-client"

import { routes } from "@/config/routes"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@shurokkha/ui/components/alert"
import type { ValidationIssue } from "@shurokkha/ui-patterns/forms"

export function issuesFromError(error: unknown): ValidationIssue[] {
  if (error instanceof ApiError && error.payload?.errors) {
    return Object.entries(error.payload.errors).flatMap(([field, messages]) =>
      messages.map((message) => ({ field, message }))
    )
  }

  return []
}

export function errorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError || error instanceof Error) return error.message
  return fallback
}

export function ApiFailure({
  error,
  fallback = "Something went wrong. Please try again.",
}: {
  error: unknown
  fallback?: string
}) {
  const isUnauthorized = error instanceof ApiError && error.status === 401

  return (
    <Alert variant="destructive">
      <AlertTitle>
        {isUnauthorized ? "Sign in required" : "Unable to continue"}
      </AlertTitle>
      <AlertDescription>
        {isUnauthorized ? (
          <>
            Your session is missing or expired.{" "}
            <Link href={routes.auth.signIn}>Sign in</Link> to continue.
          </>
        ) : (
          errorMessage(error, fallback)
        )}
      </AlertDescription>
    </Alert>
  )
}
