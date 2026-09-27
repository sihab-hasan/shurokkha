"use client"

import { MissingPersonStats } from "../components/missing-person-stats"
import { MissingPersonToolbar } from "../components/missing-person-toolbar"
import { MissingPersonTablePrefsMenu } from "../components/missing-person-table-prefs-menu"
import { MissingPersonFilterChips } from "../components/missing-person-filter-chips"
import { MissingPersonList } from "../components/missing-person-list"
import { MissingPersonPagination } from "../components/missing-person-pagination"

/**
 * Page-level section for `/account/missing-persons`. Owns the
 * filter-driven composition: stats → toolbar + table prefs → filter
 * chips → list → pagination. The route page renders
 * `<MissingPersonSection />` as a single peer call inside a
 * `<Suspense fallback={<MissingPersonSkeleton />}>`
 */
export function MissingPersonSection() {
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
