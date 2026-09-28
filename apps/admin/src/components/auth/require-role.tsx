"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, type ReactNode } from "react"

import type { UserRole } from "@shurokkha/contracts"

import { useAuth } from "@/hooks/auth/use-auth"

interface RequireRoleProps {
  /** Required role(s). Redirects to `/` if the session does not match. */
  role: UserRole | UserRole[]
  children: ReactNode
}

/**
 * Client-side role guard. Sits on top of `RequireAuth` (which must wrap the
 * tree upstream so the session is resolved before this runs). Redirects
 * users whose role does not match back to the dashboard home.
 */
export function RequireRole({ role, children }: RequireRoleProps) {
  const router = useRouter()
  const { status, user } = useAuth()
  const required = useMemo(() => (Array.isArray(role) ? role : [role]), [role])

  useEffect(() => {
    if (status !== "authenticated" || !user) return
    if (!required.includes(user.role)) {
      router.replace("/")
    }
  }, [router, status, user, required])

  if (status === "authenticated" && user && required.includes(user.role)) {
    return <>{children}</>
  }

  return (
    <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
      Verifying access…
    </div>
  )
}
