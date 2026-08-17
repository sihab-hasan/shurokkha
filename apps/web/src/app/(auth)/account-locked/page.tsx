import type { Metadata } from "next"
import { LockKeyhole } from "lucide-react"

import { AuthStateView } from "@/components/auth/auth-state-view"

import { routes } from "@/config/routes"

const pageTitle = "Account Locked"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "Your Shurokkha account is temporarily locked and requires verification or support.",
}

export default function AccountLocked() {
  return (
    <AuthStateView
      icon={LockKeyhole}
      tone="warning"
      title="Your account is temporarily locked"
      description="This page represents a locked-account state. Account status and recovery are not connected yet."
      primaryLabel="Reset password"
      primaryHref={routes.auth.forgotPassword}
      secondaryLabel="Return home"
      secondaryHref={routes.home}
    />
  )
}
