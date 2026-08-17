"use client"

import { useState } from "react"
import Link from "next/link"

import { buttonVariants } from "@shurokkha/ui/components/button"
import { Checkbox } from "@shurokkha/ui/components/checkbox"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { cn } from "@shurokkha/ui/lib/utils"

import { SocialAuth, type Provider } from "@/components/auth/social-auth"
import { AuthPasswordInput } from "./auth-password-input"

import { routes } from "@/config/routes"

export function SignInForm() {
  const [message, setMessage] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(
      "Sign-in is not connected yet. Your entries remain on this page."
    )
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
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Checkbox id="remember" name="remember" />
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
          <Alert aria-live="polite">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <button
          type="submit"
          className={cn(buttonVariants({ size: "lg" }), "h-11 w-full")}
        >
          Sign in
        </button>
      </form>
    </div>
  )
}
