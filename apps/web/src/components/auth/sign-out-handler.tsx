"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth/auth-provider"
import { routes } from "@/config/routes"

export function SignOutHandler() {
  const router = useRouter()
  const { signOut } = useAuth()

  useEffect(() => {
    void signOut()
      .catch(() => undefined)
      .finally(() => {
        router.replace(routes.home)
        router.refresh()
      })
  }, [router, signOut])

  return null
}
