"use client"

import { SettingsCard } from "@shurokkha/ui/components/settings-card"
import { SettingsSection } from "@shurokkha/ui/components/settings-section"

import { LoginHistoryList } from "./login-history-list"
import { PasswordForm } from "./password-form"
import { TwoFactorCard } from "./two-factor-card"

/**
 * Client island for the security management page. Mirrors the
 * `*Sections` pattern: a flat composition of every section that makes
 * up the page, while the route page itself stays as a Server Component
 * inside the Suspense boundary.
 *
 * Sections (top-to-bottom):
 *  - Password     → sign-in credentials
 *  - Auth         → two-factor authentication
 *  - Activity     → login history
 */
export function SecuritySections() {
  return (
    <div className="space-y-6">
      <PasswordSection />
      <TwoFactorCard />
      <LoginHistorySection />
    </div>
  )
}

function PasswordSection() {
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

function LoginHistorySection() {
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
