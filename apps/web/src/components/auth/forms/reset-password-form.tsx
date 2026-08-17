"use client"

import { useState } from "react"

import { buttonVariants } from "@shurokkha/ui/components/button"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { Label } from "@shurokkha/ui/components/label"
import { cn } from "@shurokkha/ui/lib/utils"

import { AuthPasswordInput } from "./auth-password-input"

export function ResetPasswordForm() {
  const [message, setMessage] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Check both fields and try again.")
      return
    }

    setMessage("Password reset is not connected yet. No changes were saved.")
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">New password</Label>
          <AuthPasswordInput
            id="password"
            name="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
            aria-describedby="reset-password-hint"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setMessage(null)
            }}
          />
          <p
            id="reset-password-hint"
            className="text-xs leading-5 text-muted-foreground"
          >
            Use at least 8 characters.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <AuthPasswordInput
            id="confirm-password"
            name="confirmPassword"
            placeholder="Repeat your new password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
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

      {message ? (
        <Alert aria-live="polite">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      <button
        type="submit"
        className={cn(buttonVariants({ size: "lg" }), "h-11 w-full")}
      >
        Save new password
      </button>
    </form>
  )
}
