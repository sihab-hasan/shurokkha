"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { LogIn, ShieldCheck } from "lucide-react"

import { ApiError } from "@shurokkha/api-client"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"

import { useAuth } from "@/components/auth/auth-provider"
import { getShurokkhaApi } from "@/lib/api"

type LoginFormProps = {
  redirectTo?: string
}

export function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const router = useRouter()
  const { establishSession, status } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
        // The backend message is already user-facing for auth errors
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
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="size-5" aria-hidden />
        </div>
        <CardTitle className="text-xl">Admin sign in</CardTitle>
        <CardDescription>
          Use your Shurokkha admin credentials to access the console.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-2">
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
          <div className="space-y-2">
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
            <p
              role="alert"
              className="text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !email || !password}
          >
            <LogIn className="size-4" aria-hidden />
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
          {status === "authenticated" ? (
            <p
              role="status"
              className="text-center text-xs text-muted-foreground"
            >
              You are already signed in. Redirecting…
            </p>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              Need access? Contact your workspace administrator.
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}