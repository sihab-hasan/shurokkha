import type { ApiUser, UserRole } from "@shurokkha/contracts"

import { routes } from "@/config/routes"

export function dashboardRouteForRole(role: UserRole) {
  return routes[role].home
}

export function profileRouteForRole(role: UserRole) {
  return routes[role].profile
}

export function settingsRouteForRole(role: UserRole) {
  return routes[role].settings
}

export function dashboardRouteForUser(user: Pick<ApiUser, "role">) {
  return dashboardRouteForRole(user.role)
}

export function safeReturnTo(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null

  const path = value.split("?")[0]?.split("#")[0] || "/"
  const blocked = new Set<string>([
    routes.auth.signIn,
    routes.auth.signUp,
    routes.auth.signOut,
  ])

  return blocked.has(path) ? null : value
}

export function signInRouteWithReturnTo(returnTo: string) {
  const safe = safeReturnTo(returnTo)
  if (!safe) return routes.auth.signIn

  const search = new URLSearchParams({ returnTo: safe })
  return `${routes.auth.signIn}?${search.toString()}`
}
