import type { Metadata } from "next"
import { ShieldX } from "lucide-react"

import { AuthStateView } from "@/components/auth/auth-state-view"

import { routes } from "@/config/routes"

const pageTitle = "Access Denied"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "You do not have permission to access this Shurokkha page or resource.",
}

export default function AccessDenied() {
  return (
    <AuthStateView
      icon={ShieldX}
      tone="warning"
      title="You don’t have access"
      description="Your current account can’t open this page. Sign in with an authorized account or return to the public site."
      primaryLabel="Sign in again"
      primaryHref={routes.auth.signIn}
      secondaryLabel="Return home"
      secondaryHref={routes.home}
    />
  )
}
