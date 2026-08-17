"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

import type { UserRole } from "@shurokkha/contracts"
import { ErrorState, LoadingState } from "@shurokkha/ui-patterns/feedback"

import { useAuth } from "@/components/auth/auth-provider"
import {
  dashboardRouteForUser,
  signInRouteWithReturnTo,
} from "@/lib/auth-navigation"

export function useAuthUser() {
  return useAuth().user
}

export function AuthGate({
  children,
  role,
}: {
  children: ReactNode
  role?: UserRole
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { status, user, error, refresh } = useAuth()

  useEffect(() => {
    if (status === "guest") {
      const currentUrl = `${pathname}${window.location.search}${window.location.hash}`
      router.replace(signInRouteWithReturnTo(currentUrl))
      return
    }

    if (status === "authenticated" && user && role && user.role !== role) {
      router.replace(dashboardRouteForUser(user))
    }
  }, [pathname, role, router, status, user])

  if (status === "checking") {
    return (
      <LoadingState
        label="Verifying your secure session…"
        className="min-h-screen"
      />
    )
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center p-6">
        <ErrorState
          title="Unable to verify your session"
          description={error || "The authentication service is unavailable."}
          onRetry={() => void refresh()}
          className="w-full"
        />
      </div>
    )
  }

  if (status !== "authenticated" || !user || (role && user.role !== role)) {
    return (
      <LoadingState
        label="Taking you to the right page…"
        className="min-h-screen"
      />
    )
  }

  return children
}
