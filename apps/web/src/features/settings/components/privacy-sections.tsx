"use client"

import { PrivacyPrefsForm } from "./privacy-prefs-form"

/**
 * Client island for the privacy management page. Mirrors the
 * `*Sections` pattern used by `ProfileSections`, `NotificationsSections`,
 * `AssistanceSections`, etc.: a flat composition that orchestrates the
 * form sections and keeps the route page itself as a Server Component
 * inside the Suspense boundary.
 *
 * Sections (top-to-bottom, managed inside the form):
 *  - Sharing    → location sharing
 *  - Visibility → profile visibility
 *  - Donations  → anonymous donations
 *  - Danger     → data export + delete account (coming soon)
 */
export function PrivacySections() {
  return (
    <div className="space-y-6">
      <PrivacyPrefsForm />
    </div>
  )
}
