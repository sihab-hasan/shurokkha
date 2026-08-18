import type { Metadata } from "next"
import { EntityHeader, EntityStatus } from "@shurokkha/ui-patterns/entity"
import { WidgetFrame } from "@shurokkha/ui-patterns/dashboard"
import { EmergencyRequestForm } from "@/components/app/emergency-request-form"

export const metadata: Metadata = { title: "Request Emergency Help" }

export default function RequestHelpPage() {
  return (
    <div className="space-y-6">
      <EntityHeader
        title="Request Emergency Help"
        subtitle="Submit urgent evacuation, rescue, medical, or shelter requests directly to first responders."
        status={<EntityStatus tone="danger">24/7 Active Response</EntityStatus>}
      />

      <EmergencyRequestForm />

      <WidgetFrame
        title="Emergency Protocol Guidance"
        description="Tips for submitting accurate distress signals during acute disaster events"
      >
        <div className="grid gap-4 text-xs leading-relaxed text-muted-foreground sm:grid-cols-3">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              1. Keep phone line open
            </p>
            <p>
              Rescue teams will attempt phone confirmation prior to boat or
              ambulance dispatch.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              2. Target Nearest Shelter
            </p>
            <p>
              Selecting your nearest designated cyclone/flood shelter
              accelerates coordination.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">3. Real-Time Sync</p>
            <p>
              Requests are immediately registered into the MySQL disaster relief
              database.
            </p>
          </div>
        </div>
      </WidgetFrame>
    </div>
  )
}
