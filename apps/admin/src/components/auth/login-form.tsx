"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"

import { ApiError } from "@shurokkha/api-client"
import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"

import { useAuth } from "@/components/auth/auth-provider"
import { getShurokkhaApi } from "@/lib/api"

type LoginFormProps = {
  redirectTo?: string
}

/**
 * Default credentials for the seeded admin account so the operator can
 * sign in immediately. These mirror the values seeded by the backend
 * (`admin@gmail.com` / `Admin123!`) and are intended for the dev/admin
 * onboarding flow only. If you change the password here you must mirror
 * it in `services/api/database/seeders/DatabaseSeeder.php`.
 */
const SEEDED_EMAIL = "admin@gmail.com"
const SEEDED_PASSWORD = "Admin123!"

export function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const router = useRouter()
  const { establishSession, status } = useAuth()
  const [email, setEmail] = useState(SEEDED_EMAIL)
  const [password, setPassword] = useState(SEEDED_PASSWORD)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await getShurokkhaApi().auth.login({ email, password })
      establishSession(response.user)
      router.replace(redirectTo)
      router.refresh()
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        // Backend message is already user-facing for auth errors
        // (e.g. "These credentials do not match our records.").
        setError(submitError.message)
      } else if (submitError instanceof Error) {
        setError(submitError.message)
      } else {
        setError("Unable to sign in. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      <header className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="text-sm text-muted-foreground">
          Use your Shurokkha admin credentials to access the console.
        </p>
      </header>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (error) setError(null)
            }}
            placeholder="admin@shurokkha.com"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (error) setError(null)
            }}
            placeholder="••••••••"
            disabled={isSubmitting}
          />
        </div>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>

      <div className="space-y-2.5">
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !email || !password}
        >
          <LogIn className="size-4" aria-hidden />
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          {status === "authenticated"
            ? "You are already signed in. Redirecting…"
            : "Need access? Contact your workspace administrator."}
        </p>
      </div>
    </form>
  )
}
