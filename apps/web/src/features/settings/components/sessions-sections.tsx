"use client"

import {
  ActiveSessionsCard,
  CurrentDeviceCard,
  SignOutEverywhereCard,
} from "./sessions-current-device-card"

/**
 * Client island for the sessions management page. Mirrors the
 * `*Sections` pattern: a flat composition of every section that makes
 * up the page, while the route page itself stays as a Server Component
 * inside the Suspense boundary.
 *
 * Sections (top-to-bottom):
 *  - This device   → current session info
 *  - All devices   → list of every active session
 *  - Danger zone   → sign out all other sessions
 */
export function SessionsSections() {
  return (
    <div className="space-y-6">
      <CurrentDeviceCard />
      <ActiveSessionsCard />
      <SignOutEverywhereCard />
    </div>
  )
}
