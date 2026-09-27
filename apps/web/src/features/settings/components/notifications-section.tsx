"use client"

import { NotificationPrefsForm } from "../components/notification-prefs-form"

/**
 * Page-level section for `/account/settings/notifications`. Currently
 * a single composition (Delivery → Events → Schedule, already managed
 * inside the form); wrapped here so adding future sub-sections (e.g.
 * per-channel digests) is a one-line change at this layer.
 */
export function NotificationsSection() {
  return (
    <div className="space-y-6">
      <NotificationPrefsForm />
    </div>
  )
}
