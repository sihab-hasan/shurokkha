"use client"

import { useState } from "react"

import { buttonVariants } from "@shurokkha/ui/components/button"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { cn } from "@shurokkha/ui/lib/utils"

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(
      "Password recovery is not connected yet. No email has been sent."
    )
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          aria-describedby="recovery-email-hint"
          className="h-10 rounded-md"
          onChange={() => setMessage(null)}
        />
        <p
          id="recovery-email-hint"
          className="text-xs leading-5 text-muted-foreground"
        >
          We&apos;ll send password reset instructions to this address.
        </p>
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
        Send reset link
      </button>
    </form>
  )
}
