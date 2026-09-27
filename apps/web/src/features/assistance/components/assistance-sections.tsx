"use client"

import { AssistanceStats } from "./assistance-stats"
import { AssistanceToolbar } from "./assistance-toolbar"
import { AssistanceTablePrefsMenu } from "./assistance-table-prefs-menu"
import { AssistanceFilterChips } from "./assistance-filter-chips"
import { AssistanceList } from "./assistance-list"
import { AssistancePagination } from "./assistance-pagination"

export function AssistanceSections() {
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
