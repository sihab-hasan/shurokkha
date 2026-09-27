"use client"

import { PrivacyPrefsForm } from "../components/privacy-prefs-form"

/**
 * Page-level section for `/account/settings/privacy`. Currently a
 * single composition (Sharing → Visibility → Donations → Danger,
 * already managed inside the form); wrapped here so adding future
 * sub-sections is a one-line change at this layer.
 */
export function PrivacySection() {
  return (
    <div className="space-y-6">
      <PrivacyPrefsForm />
    </div>
  )
}
