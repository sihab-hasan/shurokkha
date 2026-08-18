"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { buttonVariants } from "@shurokkha/ui/components/button"
import { Checkbox } from "@shurokkha/ui/components/checkbox"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { cn } from "@shurokkha/ui/lib/utils"
import { ApiError } from "@shurokkha/api-client"

import { SocialAuth, type Provider } from "@/components/auth/social-auth"
import { AuthPasswordInput } from "./auth-password-input"
import { routes } from "@/config/routes"
import { getShurokkhaApi } from "@/lib/api"
import { useAuth } from "@/components/auth/auth-provider"
import { dashboardRouteForUser, safeReturnTo } from "@/lib/auth-navigation"

export function SignInForm() {
  const router = useRouter()
  const { establishSession } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setIsLoading(true)

    try {
      const response = await getShurokkhaApi().auth.login({
        email,
        password,
        remember,
      })
      establishSession(response.user)

      setIsSuccess(true)
      setMessage("Signed in successfully. Redirecting…")

      const returnTo = safeReturnTo(
        new URLSearchParams(window.location.search).get("returnTo")
      )
      router.replace(returnTo || dashboardRouteForUser(response.user))
      router.refresh()
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.message)
      } else if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage("Invalid email or password.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  function handleProvider(provider: Provider) {
    const providerName = provider[0]?.toUpperCase() + provider.slice(1)
    setMessage(`${providerName} sign-in is not connected yet.`)
  }

  return (
    <div className="flex flex-col gap-6">
      <SocialAuth onProviderSelect={handleProvider} />

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value)
                setMessage(null)
              }}
              className="h-10 rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <AuthPasswordInput
              id="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              value={password}
              disabled={isLoading}
              onChange={(e) => {
                setPassword(e.target.value)
                setMessage(null)
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Checkbox
              id="remember"
              name="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
          <Link
            href={routes.auth.forgotPassword}
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {message ? (
          <Alert
            aria-live="polite"
            className={
              isSuccess
                ? "border-green-500 text-green-600 dark:text-green-400"
                : ""
            }
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className={cn(buttonVariants({ size: "lg" }), "h-11 w-full")}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  )
}
