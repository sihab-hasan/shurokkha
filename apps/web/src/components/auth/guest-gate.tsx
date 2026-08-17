"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import { LoadingState } from "@shurokkha/ui-patterns/feedback"

import { useAuth } from "@/components/auth/auth-provider"
import { dashboardRouteForUser, safeReturnTo } from "@/lib/auth-navigation"

export function GuestGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { status, user } = useAuth()

  useEffect(() => {
    if (status !== "authenticated" || !user) return

    router.replace(
      safeReturnTo(
        new URLSearchParams(window.location.search).get("returnTo")
      ) || dashboardRouteForUser(user)
    )
  }, [router, status, user])

  if (status === "checking" || (status === "authenticated" && user)) {
    return <LoadingState label="Checking your session…" className="min-h-40" />
  }

  return children
}
