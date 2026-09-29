"use client"

import { Info } from "lucide-react"

/**
 * Placeholder for the team-member form. The backend does not yet expose
 * member endpoints; this view exists so the route resolves and the
 * "Not available yet" notice is visible in the admin shell.
 */
export function TeamMemberForm() {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="space-y-1 text-muted-foreground">
        <p className="font-medium text-foreground">Not available yet</p>
        <p>
          The team-member backend endpoints are not exposed yet. This form will
          be wired up once the API client adds{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            api.admin.teamMembers
          </code>
          .
        </p>
      </div>
    </div>
  )
}
