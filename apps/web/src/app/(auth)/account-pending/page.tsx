import type { Metadata } from "next"
import { Clock3 } from "lucide-react"

import { AuthStateView } from "@/components/auth/auth-state-view"

import { routes } from "@/config/routes"

const pageTitle = "Account Pending"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "Your Shurokkha account is waiting for verification or approval.",
}

export default function AccountPending() {
  return (
    <AuthStateView
      icon={Clock3}
      title="Your account is under review"
      description="This page represents an account awaiting verification. Live approval status is not connected yet."
      primaryLabel="Return home"
      primaryHref={routes.home}
      secondaryLabel="Back to sign in"
      secondaryHref={routes.auth.signIn}
    />
  )
}
