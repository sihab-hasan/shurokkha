"use client"

import type { ReactNode } from "react"

import { useCan, type UseCanOptions } from "@/hooks/auth/use-can"

interface CanProps extends UseCanOptions {
  children: ReactNode
  /** Optional fallback rendered when the gate blocks the children. */
  fallback?: ReactNode
}

/**
 * Declarative role/permission gate. Renders `children` only when the current
 * session satisfies every constraint in `options`; otherwise renders
 * `fallback` (defaults to `null`).
 *
 * Pair with `useCan` for imperative checks (e.g. disabling a button).
 */
export function Can({ children, fallback = null, ...options }: CanProps) {
  const { allowed } = useCan(options)
  return <>{allowed ? children : fallback}</>
}
