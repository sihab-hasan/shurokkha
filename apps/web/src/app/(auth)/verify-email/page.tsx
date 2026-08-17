import type { Metadata } from "next"
import { MailCheck } from "lucide-react"

import { AuthStateView } from "@/components/auth/auth-state-view"
import { VerifyEmailActions } from "@/components/auth/verify-email-actions"

import { routes } from "@/config/routes"

const pageTitle = "Verify Email"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "Verify your email address to activate and secure your Shurokkha account.",
}

export default function VerifyEmail() {
  return (
    <AuthStateView
      icon={MailCheck}
      title="Check your email"
      description="Email verification is not connected yet. This page shows the confirmation state that will appear after account creation."
      primaryLabel="Back to sign in"
      primaryHref={routes.auth.signIn}
      secondaryLabel="Return home"
      secondaryHref={routes.home}
    >
      <VerifyEmailActions />
    </AuthStateView>
  )
}
