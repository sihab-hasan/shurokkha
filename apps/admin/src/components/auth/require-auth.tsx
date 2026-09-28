"use client"

import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

import { useAuth } from "@/hooks/auth/use-auth"

/**
 * Client-side route guard. Redirects unauthenticated users to `/login` and
 * renders a loading shell while the session is being resolved.
 *
 * Intended for use in `(dashboard)/layout.tsx` so every operator screen
 * shares the same gate.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { status } = useAuth()

  useEffect(() => {
    if (status === "guest" || status === "error") {
      router.replace("/login")
    }
  }, [router, status])

  if (status === "authenticated") {
    return <>{children}</>
  }

  return (
    <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
      Verifying session…
    </div>
  )
}
