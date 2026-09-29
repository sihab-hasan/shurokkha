"use client"

import { useReportSummary } from "@/hooks/operations/use-reports"

import { ReportSummaryCards } from "@/components/operations/report-summary-card"

export function ReportSummaryLoader() {
  const { data, isLoading } = useReportSummary()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-24 animate-pulse rounded-lg border bg-muted/30"
          />
        ))}
      </div>
    )
  }

  return <ReportSummaryCards data={data} />
}
