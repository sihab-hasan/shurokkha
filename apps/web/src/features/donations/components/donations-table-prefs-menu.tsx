"use client"

import { TablePrefsMenu } from "@/features/shared/table-prefs-menu"

import {
  DONATIONS_COLUMN_KEYS,
  useDonationsTablePrefs,
} from "../hooks/use-table-prefs"

const COLUMN_LABELS: Record<(typeof DONATIONS_COLUMN_KEYS)[number], string> = {
  receipt: "Receipt",
  campaign: "Campaign",
  amount: "Amount",
  method: "Method",
  status: "Status",
  submitted: "Submitted",
}

export function DonationsTablePrefsMenu() {
  const { prefs, setDensity, setColumnVisible, resetPrefs } =
    useDonationsTablePrefs()

  return (
    <TablePrefsMenu
      density={prefs.density}
      onDensityChange={setDensity}
      columns={prefs.columns}
      columnOptions={DONATIONS_COLUMN_KEYS.map((key) => ({
        key,
        label: COLUMN_LABELS[key],
      }))}
      onColumnToggle={(key, visible) =>
        setColumnVisible(key as (typeof DONATIONS_COLUMN_KEYS)[number], visible)
      }
      onReset={resetPrefs}
    />
  )
}
