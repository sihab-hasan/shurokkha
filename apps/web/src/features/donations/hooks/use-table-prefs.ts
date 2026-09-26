"use client"

import { useMemo } from "react"

import { useLocalStorage } from "@/lib/use-local-storage"

export type DonationDensity = "compact" | "default" | "comfortable"

export const DONATIONS_COLUMN_KEYS = [
  "receipt",
  "campaign",
  "amount",
  "method",
  "status",
  "submitted",
] as const
export type DonationColumnKey = (typeof DONATIONS_COLUMN_KEYS)[number]

interface DonationTablePrefs {
  density: DonationDensity
  columns: Record<DonationColumnKey, boolean>
}

const STORAGE_KEY = "shurokkha:donations:table-prefs:v1"

const DEFAULT_PREFS: DonationTablePrefs = {
  density: "default",
  columns: {
    receipt: true,
    campaign: true,
    amount: true,
    method: true,
    status: true,
    submitted: true,
  },
}

export function useDonationsTablePrefs() {
  const [prefs, setPrefs] = useLocalStorage<DonationTablePrefs>(
    STORAGE_KEY,
    DEFAULT_PREFS
  )

  const setDensity = (density: DonationDensity) => {
    setPrefs((prev) => ({ ...prev, density }))
  }

  const setColumnVisible = (column: DonationColumnKey, visible: boolean) => {
    setPrefs((prev) => ({
      ...prev,
      columns: { ...prev.columns, [column]: visible },
    }))
  }

  const resetPrefs = () => setPrefs(DEFAULT_PREFS)

  return useMemo(
    () => ({ prefs, setDensity, setColumnVisible, resetPrefs }),
    [prefs, setPrefs]
  )
}
