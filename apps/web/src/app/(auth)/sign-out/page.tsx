import type { Metadata } from "next"
import { CircleCheck } from "lucide-react"

import { AuthStateView } from "@/components/auth/auth-state-view"
import { SignOutHandler } from "@/components/auth/sign-out-handler"

import { routes } from "@/config/routes"

const pageTitle = "Signed Out"

export const metadata: Metadata = {
  title: pageTitle,
  description: "You have securely signed out of your Shurokkha account.",
}

export default function LogoutPage() {
  return (
    <>
      <SignOutHandler />
      <AuthStateView
        icon={CircleCheck}
        title="You’re signed out"
        description="Your Shurokkha session has ended. Sign in again when you’re ready to continue, or return to the public site."
        tone="success"
        primaryLabel="Sign in again"
        primaryHref={routes.auth.signIn}
        secondaryLabel="Return home"
        secondaryHref={routes.home}
      />
    </>
  )
}
