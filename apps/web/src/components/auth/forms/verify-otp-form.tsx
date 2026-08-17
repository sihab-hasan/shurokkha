"use client"

import { useEffect, useState } from "react"

import { buttonVariants } from "@shurokkha/ui/components/button"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@shurokkha/ui/components/input-otp"
import { Label } from "@shurokkha/ui/components/label"
import { cn } from "@shurokkha/ui/lib/utils"

const otpIndexes = [0, 1, 2, 3, 4, 5]

export function VerifyOtpForm() {
  const [code, setCode] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [resendSeconds, setResendSeconds] = useState(30)

  useEffect(() => {
    if (resendSeconds <= 0) return

    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [resendSeconds])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (code.length !== 6) {
      setMessage("Enter all six digits to continue.")
      return
    }

    setMessage("Code verification is not connected yet.")
  }

  function handleResend() {
    if (resendSeconds > 0) return

    setCode("")
    setResendSeconds(30)
    setMessage("Code delivery is not connected yet.")
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="verification-code">Verification code</Label>
          <span className="text-xs text-muted-foreground">6 digits</span>
        </div>

        <InputOTP
          id="verification-code"
          name="verificationCode"
          value={code}
          onChange={(value) => {
            setCode(value)
            setMessage(null)
          }}
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          required
          aria-label="Six-digit verification code"
          containerClassName="w-full"
        >
          <InputOTPGroup className="w-full gap-2">
            {otpIndexes.map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="h-14 min-w-0 flex-1 rounded-xl border border-input bg-input/40 text-xl font-semibold tabular-nums shadow-xs first:rounded-xl first:border last:rounded-xl data-[active=true]:border-primary data-[active=true]:ring-primary/20"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <p className="text-sm leading-6 text-muted-foreground">
          Paste the code or enter it one digit at a time.
        </p>
      </div>

      {message ? (
        <Alert aria-live="polite">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      <button
        type="submit"
        disabled={code.length !== 6}
        className={cn(buttonVariants({ size: "lg" }), "h-11 w-full")}
      >
        Verify code
      </button>

      <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <span>Didn&apos;t receive the code?</span>
        <button
          type="button"
          disabled={resendSeconds > 0}
          className="font-medium text-primary hover:text-primary/80 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          onClick={handleResend}
        >
          {resendSeconds > 0
            ? `Resend in 0:${String(resendSeconds).padStart(2, "0")}`
            : "Resend code"}
        </button>
      </div>
    </form>
  )
}
