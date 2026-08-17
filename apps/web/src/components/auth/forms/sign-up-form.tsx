"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { buttonVariants } from "@shurokkha/ui/components/button"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { Checkbox } from "@shurokkha/ui/components/checkbox"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { cn } from "@shurokkha/ui/lib/utils"
import { createApiClient, ApiError } from "@shurokkha/api-client"

import { SocialAuth, type Provider } from "@/components/auth/social-auth"
import { AuthPasswordInput } from "./auth-password-input"
import { routes } from "@/config/routes"

interface RegisterResponse {
  status: string
  message: string
  user: {
    id: number
    name: string
    email: string
  }
  token: string
}

export function SignUpForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const apiClient = createApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Check both fields and try again.")
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.post<RegisterResponse>("register", {
        name,
        email,
        password,
      })

      if (response.token) {
        localStorage.setItem("auth_token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
      }

      setIsSuccess(true)
      setMessage("Account created successfully! Redirecting...")

      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.message)
      } else if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage("An unexpected error occurred during account creation.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  function handleProvider(provider: Provider) {
    const providerName = provider[0]?.toUpperCase() + provider.slice(1)
    setMessage(`${providerName} account creation is not connected yet.`)
  }

  return (
    <div className="flex flex-col gap-6">
      <SocialAuth onProviderSelect={handleProvider} />

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your full name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setMessage(null)
              }}
              disabled={isLoading}
              className="h-10 rounded-md"
            />
          </div>
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
              onChange={(e) => {
                setEmail(e.target.value)
                setMessage(null)
              }}
              disabled={isLoading}
              className="h-10 rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <AuthPasswordInput
              id="password"
              name="password"
              placeholder="Create a secure password"
              autoComplete="new-password"
              minLength={8}
              required
              aria-describedby="signup-password-hint"
              value={password}
              disabled={isLoading}
              onChange={(event) => {
                setPassword(event.target.value)
                setMessage(null)
              }}
            />
            <p
              id="signup-password-hint"
              className="text-xs leading-5 text-muted-foreground"
            >
              Use at least 8 characters.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <AuthPasswordInput
              id="confirm-password"
              name="confirmPassword"
              placeholder="Repeat your password"
              autoComplete="new-password"
              minLength={8}
              required
              value={confirmPassword}
              disabled={isLoading}
              aria-invalid={
                confirmPassword.length > 0 && password !== confirmPassword
              }
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setMessage(null)
              }}
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            name="terms"
            required
            disabled={isLoading}
            className="mt-0.5"
          />
          <Label
            htmlFor="terms"
            className="block text-sm leading-5 font-normal"
          >
            I agree to the terms of service and privacy policy
          </Label>
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
          {isLoading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={routes.auth.signIn}
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
