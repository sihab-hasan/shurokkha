/**
 * Role-Based Access Control (RBAC) for the account area.
 *
 * Roles: user | admin
 *
 * - user  — any registered person; can request assistance, donate, volunteer,
 *            report missing persons, manage their household, etc.
 * - admin  — full access to all modules.
 *
 * RBAC is enforced client-side for navigation/UI visibility only.
 * Server-side enforcement lives in the Laravel API service.
 */

import type { UserRole } from "@shurokkha/contracts"

export type { UserRole }

export type AccountModule =
  | "dashboard"
  | "appeals"
  | "assistance"
  | "complaints"
  | "documents"
  | "donations"
  | "feedback"
  | "help-requests"
  | "household"
  | "missing-persons"
  | "notifications"
  | "privacy"
  | "profile"
  | "security"
  | "shelter"
  | "volunteering"

// ---------------------------------------------------------------------------
// Module permissions per role
// ---------------------------------------------------------------------------

const ALL_MODULES: AccountModule[] = [
  "dashboard",
  "appeals",
  "assistance",
  "complaints",
  "documents",
  "donations",
  "feedback",
  "help-requests",
  "household",
  "missing-persons",
  "notifications",
  "privacy",
  "profile",
  "security",
  "shelter",
  "volunteering",
]

const ROLE_PERMISSIONS: Record<UserRole, AccountModule[]> = {
  /** Regular users have access to all account modules. */
  user: ALL_MODULES,

  /** Admins have access to all modules. */
  admin: ALL_MODULES,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true when the given role has access to the requested module.
 * Returns false when `role` is absent or unrecognised.
 */
export function hasModuleAccess(
  role: UserRole | string | undefined | null,
  module: AccountModule
): boolean {
  if (!role) return false
  const allowed = ROLE_PERMISSIONS[role as UserRole]
  if (!allowed) return false
  return allowed.includes(module)
}

/**
 * Filters a navigation item array to only the entries permitted by `role`.
 * Items without a `module` or `roles` constraint pass through unconditionally.
 */
export function filterNavForRole<
  T extends { module?: AccountModule; roles?: UserRole[] },
>(items: T[], role: UserRole | string | undefined | null): T[] {
  if (!role) return []

  const userRole = role as UserRole

  return items.filter((item) => {
    // Explicit role whitelist takes precedence
    if (item.roles && item.roles.length > 0) {
      return item.roles.includes(userRole)
    }
    // Module-based permission check
    if (item.module) {
      return hasModuleAccess(userRole, item.module)
    }
    // No constraint — visible to all authenticated users
    return true
  })
}
