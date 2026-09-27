"use client"

import { DonationsStats } from "../components/donations-stats"
import { DonationsToolbar } from "../components/donations-toolbar"
import { DonationsTablePrefsMenu } from "../components/donations-table-prefs-menu"
import { DonationsFilterChips } from "../components/donations-filter-chips"
import { DonationsList } from "../components/donations-list"
import { DonationsPagination } from "../components/donations-pagination"

/**
 * Page-level section for `/account/donations`. Owns the filter-driven
 * composition: stats → toolbar + table prefs → filter chips → list →
 * pagination. The route page renders `<DonationsSection />` as a
 * single peer call inside a `<Suspense fallback={<DonationsSkeleton />}>`
 */
export function DonationsSection() {
  return (
    <div className="space-y-6">
      <DonationsStats />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <DonationsToolbar />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DonationsTablePrefsMenu />
        </div>
      </div>
      <DonationsFilterChips />
      <DonationsList />
      <DonationsPagination />
    </div>
  )
}
