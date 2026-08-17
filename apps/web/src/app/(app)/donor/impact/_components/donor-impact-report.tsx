import { Gift, HandHeart, PackageCheck } from "lucide-react"

import { MetricStrip, MetricStripItem } from "@shurokkha/ui-patterns/dashboard"
import { DataFreshness } from "@shurokkha/ui-patterns/feedback"
import { ReportHeader, ReportViewer } from "@shurokkha/ui-patterns/reporting"

export function DonorImpactReport() {
  return (
    <div className="space-y-6">
      <ReportHeader
        title="Impact report"
        description="See measurable outcomes supported by your contributions."
        period="Current calendar year"
        status="Verified activity"
      />

      <MetricStrip columns={3}>
        <MetricStripItem
          label="Families reached"
          value="86"
          detail="Food, shelter, or medical support delivered"
          icon={<HandHeart />}
        />
        <MetricStripItem
          label="Essential items delivered"
          value="240"
          detail="Water, blankets, hygiene kits, and medicine"
          icon={<PackageCheck />}
        />
        <MetricStripItem
          label="Campaigns supported"
          value="12"
          detail="Across four active response districts"
          icon={<Gift />}
        />
      </MetricStrip>

      <ReportViewer
        flush={false}
        toolbar={
          <DataFreshness
            status="fresh"
            updatedAt="Verified for the current reporting period"
          />
        }
        footer="Impact totals include verified activity from the current calendar year."
      >
        <p className="text-sm leading-7 text-muted-foreground">
          Detailed impact charts and beneficiary-safe aggregate reporting will
          render here when the reporting API is connected.
        </p>
      </ReportViewer>
    </div>
  )
}
