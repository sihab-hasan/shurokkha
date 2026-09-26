"use client"

import { DonationsStats } from "./donations-stats"
import { DonationsToolbar } from "./donations-toolbar"
import { DonationsTablePrefsMenu } from "./donations-table-prefs-menu"
import { DonationsFilterChips } from "./donations-filter-chips"
import { DonationsList } from "./donations-list"
import { DonationsPagination } from "./donations-pagination"

export function DonationsSections() {
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
