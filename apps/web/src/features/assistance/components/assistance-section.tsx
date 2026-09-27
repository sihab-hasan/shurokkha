"use client"

import { AssistanceStats } from "../components/assistance-stats"
import { AssistanceToolbar } from "../components/assistance-toolbar"
import { AssistanceTablePrefsMenu } from "../components/assistance-table-prefs-menu"
import { AssistanceFilterChips } from "../components/assistance-filter-chips"
import { AssistanceList } from "../components/assistance-list"
import { AssistancePagination } from "../components/assistance-pagination"

/**
 * Page-level section for `/account/assistance`. Owns the filter-driven
 * composition: stats → toolbar + table prefs → filter chips → list →
 * pagination. The route page renders `<AssistanceSection />` as a
 * single peer call inside a `<Suspense fallback={<AssistanceSkeleton />}>`
 */
export function AssistanceSection() {
  return (
    <div className="space-y-6">
      <AssistanceStats />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <AssistanceToolbar />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AssistanceTablePrefsMenu />
        </div>
      </div>
      <AssistanceFilterChips />
      <AssistanceList />
      <AssistancePagination />
    </div>
  )
}
