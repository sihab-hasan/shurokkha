"use client"

import { MissingPersonStats } from "./missing-person-stats"
import { MissingPersonToolbar } from "./missing-person-toolbar"
import { MissingPersonTablePrefsMenu } from "./missing-person-table-prefs-menu"
import { MissingPersonFilterChips } from "./missing-person-filter-chips"
import { MissingPersonList } from "./missing-person-list"
import { MissingPersonPagination } from "./missing-person-pagination"

export function MissingPersonSections() {
  return (
    <div className="space-y-6">
      <MissingPersonStats />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <MissingPersonToolbar />
        </div>
        <MissingPersonTablePrefsMenu />
      </div>
      <MissingPersonFilterChips />
      <MissingPersonList />
      <MissingPersonPagination />
    </div>
  )
}
