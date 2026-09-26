"use client"

import * as React from "react"

import { Input } from "@shurokkha/ui/components/input"
import { SettingsRow } from "@shurokkha/ui/components/settings-row"

import { updatePasswordInputSchema } from "@shurokkha/contracts"

import { useUpdatePassword } from "../hooks/use-password"
import { ApiFailure, errorMessage } from "@/features/shared/api-feedback"
import { SaveBar } from "./save-bar"
import { toast } from "@shurokkha/ui/components/sonner"

export function PasswordForm() {
  const update = useUpdatePassword()

  const [currentPassword, setCurrentPassword] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<
      Record<"current_password" | "password" | "password_confirmation", string>
    >
  >({})

  const dirty =
    currentPassword.length > 0 ||
    password.length > 0 ||
    confirmPassword.length > 0

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (update.isPending) return

    const parsed = updatePasswordInputSchema.safeParse({
      current_password: currentPassword,
      password,
      password_confirmation: confirmPassword,
    })

    if (!parsed.success) {
      const next: typeof fieldErrors = {}
      for (const issue of parsed.error.issues) {
        const path = issue.path[0]
        if (
          path === "current_password" ||
          path === "password" ||
          path === "password_confirmation"
        ) {
          next[path] = issue.message
        }
      }
      setFieldErrors(next)
      return
    }

    setFieldErrors({})
    update.mutate(parsed.data, {
      onSuccess: () => {
        toast.success("Password updated. Other sessions have been signed out.")
        setCurrentPassword("")
        setPassword("")
        setConfirmPassword("")
      },
      onError: (error) => {
        toast.error(errorMessage(error, "Could not update password."))
      },
    })
  }

  return (
    <form id="password-form" onSubmit={onSubmit} className="flex flex-col">
      <ApiFailure error={update.error} fallback="Could not update password." />

      <SettingsRow
        id="current-password"
        label="Current password"
        description={
          fieldErrors.current_password ??
          "Verify it's you before changing your password."
        }
        control={
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.current_password)}
            className="sm:max-w-xs"
          />
        }
      />

      <SettingsRow
        id="new-password"
        label="New password"
        description={
          fieldErrors.password ?? (
            <span>
              At least 12 characters with upper, lower, number, and symbol.
            </span>
          )
        }
        control={
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.password)}
            className="sm:max-w-xs"
          />
        }
      />

      <SettingsRow
        id="confirm-password"
        label="Confirm new password"
        description={
          fieldErrors.password_confirmation ??
          "Type your new password once more to confirm."
        }
        control={
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.password_confirmation)}
            className="sm:max-w-xs"
          />
        }
      />

      <SaveBar
        disabled={!dirty}
        loading={update.isPending}
        label="Update password"
        onSave={() => {
          const form = document.getElementById("password-form")
          if (form instanceof HTMLFormElement) form.requestSubmit()
        }}
      />
    </form>
  )
}
