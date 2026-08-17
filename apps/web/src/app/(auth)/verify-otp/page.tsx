import type { Metadata } from "next"

import { AuthHeader } from "@shurokkha/ui-patterns/auth"
import { VerifyOtpForm } from "@/components/auth/forms/verify-otp-form"

const pageTitle = "Verify OTP"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "Enter your one-time verification code to continue securely with Shurokkha.",
}

export default function VerifyOtp() {
  return (
    <div className="flex flex-col gap-7">
      <AuthHeader
        title="Check your email"
        description="Enter the six-digit verification code we sent to your email address."
      />
      <VerifyOtpForm />
    </div>
  )
}
