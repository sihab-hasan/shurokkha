import type { Metadata } from "next"
import Link from "next/link"

import { AuthHeader } from "@shurokkha/ui-patterns/auth"
import { ForgotPasswordForm } from "@/components/auth/forms/forgot-password-form"

import { routes } from "@/config/routes"

const pageTitle = "Forgot Password"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "Request a secure password reset link for your Shurokkha account.",
}

export default function ForgotPassword() {
  return (
    <div className="flex flex-col gap-7">
      <AuthHeader
        title="Reset your password"
        description="Enter the email connected to your account. Password recovery is shown here as a frontend-only state."
      />
      <ForgotPasswordForm />
      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          href={routes.auth.signIn}
          className="font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
