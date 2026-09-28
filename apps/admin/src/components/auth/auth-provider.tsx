"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import type { ApiUser } from "@shurokkha/contracts"
import { ApiError } from "@shurokkha/api-client"

import { getShurokkhaApi, subscribeToUnauthorized } from "@/lib/api"

export type AuthStatus = "checking" | "authenticated" | "guest" | "error"

type RefreshOptions = { silent?: boolean }

interface AuthContextValue {
  status: AuthStatus
  user: ApiUser | null
  error: string | null
  refresh: (options?: RefreshOptions) => Promise<ApiUser | null>
  establishSession: (user: ApiUser) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("checking")
  const [user, setUser] = useState<ApiUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const lastCheckedAt = useRef(0)

  const markGuest = useCallback(() => {
    setUser(null)
    setError(null)
    setStatus("guest")
  }, [])

  const refresh = useCallback(
    async ({ silent = false }: RefreshOptions = {}) => {
      if (!silent) setStatus("checking")
      setError(null)

      try {
        const response = await getShurokkhaApi().auth.me()
        lastCheckedAt.current = Date.now()
        setUser(response.data)
        setStatus("authenticated")
        return response.data
      } catch (caught) {
        lastCheckedAt.current = Date.now()

        if (caught instanceof ApiError && caught.status === 401) {
          markGuest()
          return null
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "The application could not verify your session."
        )
        setStatus("error")
        return null
      }
    },
    [markGuest]
  )

  const establishSession = useCallback((nextUser: ApiUser) => {
    lastCheckedAt.current = Date.now()
    setUser(nextUser)
    setError(null)
    setStatus("authenticated")
  }, [])

  const signOut = useCallback(async () => {
    try {
      await getShurokkhaApi().auth.logout()
      markGuest()
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) {
        markGuest()
        return
      }
      throw caught
    }
  }, [markGuest])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => subscribeToUnauthorized(markGuest), [markGuest])

  useEffect(() => {
    const revalidate = () => {
      if (status !== "authenticated") return
      if (Date.now() - lastCheckedAt.current < 15_000) return
      void refresh({ silent: true })
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") revalidate()
    }

    window.addEventListener("focus", revalidate)
    window.addEventListener("pageshow", revalidate)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      window.removeEventListener("focus", revalidate)
      window.removeEventListener("pageshow", revalidate)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [refresh, status])

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, error, refresh, establishSession, signOut }),
    [status, user, error, refresh, establishSession, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error("useAuth must be used inside AuthProvider")
  return value
}
