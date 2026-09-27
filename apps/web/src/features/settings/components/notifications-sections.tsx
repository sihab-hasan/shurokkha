"use client"

import { NotificationPrefsForm } from "./notification-prefs-form"

/**
 * Client island for the notifications management page. Mirrors the
 * `*Sections` pattern used by `ProfileSections`, `AssistanceSections`,
 * and `MissingPersonSections`: a flat composition that orchestrates the
 * form sections and keeps the route page itself as a Server Component
 * inside the Suspense boundary.
 *
 * Currently a single composition (Delivery → Events → Schedule, already
 * managed inside the form); wrapped here so adding future sections
 * (e.g. per-channel digests) is a one-line change at this layer.
 */
export function NotificationsSections() {
  return (
    <div className="space-y-6">
      <NotificationPrefsForm />
    </div>
  )
}
