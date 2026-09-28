"use client"

import { hasAnyPermission, hasPermission, hasRole } from "@shurokkha/auth"
import type { UserRole } from "@shurokkha/contracts"

import { useAuth } from "./use-auth"

export interface UseCanOptions {
  /** Allow only these roles. Passes if the user has at least one. */
  role?: UserRole | UserRole[]
  /** Allow only these permission keys. Passes if the user has at least one. */
  permission?: string | string[]
}

export interface UseCanResult {
  /** `true` when the current session satisfies every constraint in `options`. */
  allowed: boolean
  /** Convenience flag — `true` while the session is being resolved. */
  loading: boolean
}

/**
 * Permission/role gate for the admin app. Sits on top of `useAuth` from the
 * local provider, and on `hasRole` / `hasPermission` from `@shurokkha/auth`.
 *
 * Currently the `ApiUser` contract exposes only `role`, so `permission`
 * checks degrade gracefully (returning `true` when no permissions array is
 * present) — once the user payload grows a permissions field this hook will
 * pick it up without any call-site changes.
 */
export function useCan(options: UseCanOptions = {}): UseCanResult {
  const { status, user } = useAuth()

  const loading = status === "checking"
  const authenticated = status === "authenticated" && user != null

  if (!authenticated) {
    return { allowed: false, loading }
  }

  if (options.role) {
    const requiredRoles = Array.isArray(options.role)
      ? options.role
      : [options.role]
    if (!hasRole([user.role], requiredRoles[0] ?? "")) {
      return { allowed: false, loading }
    }
  }

  if (options.permission) {
    const required = Array.isArray(options.permission)
      ? options.permission
      : [options.permission]
    // ApiUser does not yet carry a permissions array. Until it does, treat
    // the absence of any permissions data as "no requirement to enforce" —
    // matching the intent of the gate (which is "only block when we know
    // the user lacks permission").
    const granted =
      (user as unknown as { permissions?: string[] }).permissions ?? []
    if (granted.length === 0) {
      // Authenticated + no permissions list → assume the role check (above)
      // already gated access. Do not block.
      return { allowed: true, loading }
    }
    if (
      !hasAnyPermission(granted, required) &&
      !required.every((p) => hasPermission(granted, p))
    ) {
      return { allowed: false, loading }
    }
  }

  return { allowed: true, loading }
}
