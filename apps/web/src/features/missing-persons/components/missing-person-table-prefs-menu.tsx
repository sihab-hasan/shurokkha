"use client"

import { TablePrefsMenu } from "@/features/shared/table-prefs-menu"

import {
  MISSING_PERSON_COLUMN_KEYS,
  useMissingPersonTablePrefs,
} from "../hooks/use-table-prefs"

const COLUMN_LABELS: Record<
  (typeof MISSING_PERSON_COLUMN_KEYS)[number],
  string
> = {
  name: "Name",
  last_seen: "Last seen",
  status: "Status",
  submitted: "Submitted",
}

export function MissingPersonTablePrefsMenu() {
  const { prefs, setDensity, setColumnVisible, resetPrefs } =
    useMissingPersonTablePrefs()

  return (
    <TablePrefsMenu
      density={prefs.density}
      onDensityChange={setDensity}
      columns={prefs.columns}
      columnOptions={MISSING_PERSON_COLUMN_KEYS.map((key) => ({
        key,
        label: COLUMN_LABELS[key],
      }))}
      onColumnToggle={(key, visible) =>
        setColumnVisible(
          key as (typeof MISSING_PERSON_COLUMN_KEYS)[number],
          visible
        )
      }
      onReset={resetPrefs}
    />
  )
}
