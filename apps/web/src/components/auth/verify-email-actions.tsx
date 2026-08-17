"use client"

import { useState } from "react"

import { buttonVariants } from "@shurokkha/ui/components/button"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { cn } from "@shurokkha/ui/lib/utils"

export function VerifyEmailActions() {
  const [message, setMessage] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      {message ? (
        <Alert aria-live="polite" className="border-primary/30">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
      <button
        type="button"
        className={cn(buttonVariants({ size: "lg" }), "h-11 w-full")}
        onClick={() =>
          setMessage("A new verification email has been requested.")
        }
      >
        Resend verification email
      </button>
    </div>
  )
}
