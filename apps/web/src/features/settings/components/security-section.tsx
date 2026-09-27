"use client"

import { SettingsCard } from "@shurokkha/ui/components/settings-card"
import { SettingsSection } from "@shurokkha/ui/components/settings-section"

import { LoginHistoryList } from "../components/login-history-list"
import { PasswordForm } from "../components/password-form"
import { TwoFactorCard } from "../components/two-factor-card"

/**
 * Page-level section for `/account/settings/security`. Composes the
 * password, two-factor, and login-history sub-sections. The route
 * page renders `<SecuritySection />` as a single peer call.
 *
 * Sub-sections (top-to-bottom):
 *  - Password     → sign-in credentials
 *  - Auth         → two-factor authentication
 *  - Activity     → login history
 */
export function SecuritySection() {
  return (
    <div className="space-y-6">
      <PasswordSubSection />
      <TwoFactorCard />
      <LoginHistorySubSection />
    </div>
  )
}

function PasswordSubSection() {
  return (
    <div className="space-y-4">
      <SettingsSection
        eyebrow="Password"
        title="Sign-in credentials"
        description="Use a strong, unique password for your Shurokkha account."
      />
      <SettingsCard flush size="sm">
        <PasswordForm />
      </SettingsCard>
    </div>
  )
}

function LoginHistorySubSection() {
  return (
    <div className="space-y-4">
      <SettingsSection
        eyebrow="Activity"
        title="Login history"
        description="Last 20 sign-ins from any device or location."
      />
      <SettingsCard flush size="sm">
        <LoginHistoryList />
      </SettingsCard>
    </div>
  )
}
