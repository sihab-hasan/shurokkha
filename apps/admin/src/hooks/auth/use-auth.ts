"use client"

/**
 * Re-export the auth provider hook so it lives under the standard
 * `src/hooks/...` namespace. The auth provider is wired into the dashboard
 * layout (see `src/app/(dashboard)/layout.tsx`) and is the single source of
 * truth for the current session.
 *
 * Consumers in this app should depend on this path rather than reaching
 * directly into `src/components/auth/auth-provider`, which keeps the
 * dependency direction consistent with the rest of the operations hooks.
 */

export { useAuth } from "@/components/auth/auth-provider"
export type { AuthStatus } from "@/components/auth/auth-provider"
