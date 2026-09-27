"use client"

import {
  ActiveSessionsCard,
  CurrentDeviceCard,
  SignOutEverywhereCard,
} from "../components/sessions-current-device-card"

/**
 * Page-level section for `/account/settings/sessions`. Composes the
 * current-device, active-sessions, and sign-out-everywhere cards.
 * The route page renders `<SessionsSection />` as a single peer call.
 */
export function SessionsSection() {
  return (
    <div className="space-y-6">
      <CurrentDeviceCard />
      <ActiveSessionsCard />
      <SignOutEverywhereCard />
    </div>
  )
}
