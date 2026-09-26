"use client"

import { TablePrefsMenu } from "@/features/shared/table-prefs-menu"

import {
  ASSISTANCE_COLUMN_KEYS,
  useAssistanceTablePrefs,
} from "../hooks/use-table-prefs"

const COLUMN_LABELS: Record<(typeof ASSISTANCE_COLUMN_KEYS)[number], string> = {
  id: "ID",
  request: "Request",
  address: "Address",
  priority: "Priority",
  status: "Status",
  submitted: "Submitted",
}

export function AssistanceTablePrefsMenu() {
  const { prefs, setDensity, setColumnVisible, resetPrefs } =
    useAssistanceTablePrefs()

  return (
    <TablePrefsMenu
      density={prefs.density}
      onDensityChange={setDensity}
      columns={prefs.columns}
      columnOptions={ASSISTANCE_COLUMN_KEYS.map((key) => ({
        key,
        label: COLUMN_LABELS[key],
      }))}
      onColumnToggle={(key, visible) =>
        setColumnVisible(
          key as (typeof ASSISTANCE_COLUMN_KEYS)[number],
          visible
        )
      }
      onReset={resetPrefs}
    />
  )
}
