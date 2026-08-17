import type { Metadata } from "next"

import { AuthHeader } from "@shurokkha/ui-patterns/auth"
import { ResetPasswordForm } from "@/components/auth/forms/reset-password-form"

const pageTitle = "Reset Password"

export const metadata: Metadata = {
  title: pageTitle,
  description: "Create a new secure password for your Shurokkha account.",
}

export default function ResetPassword() {
  return (
    <div className="flex flex-col gap-7">
      <AuthHeader
        title="Choose a new password"
        description="Use at least eight characters and choose something you don’t use elsewhere."
      />
      <ResetPasswordForm />
    </div>
  )
}
