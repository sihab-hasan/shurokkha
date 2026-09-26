"use client"

import { useMemo } from "react"

import { useLocalStorage } from "@/lib/use-local-storage"

export type MissingPersonDensity = "compact" | "default" | "comfortable"

export const MISSING_PERSON_COLUMN_KEYS = [
  "name",
  "last_seen",
  "status",
  "submitted",
] as const
export type MissingPersonColumnKey = (typeof MISSING_PERSON_COLUMN_KEYS)[number]

interface MissingPersonTablePrefs {
  density: MissingPersonDensity
  columns: Record<MissingPersonColumnKey, boolean>
}

const STORAGE_KEY = "shurokkha:missing-persons:table-prefs:v1"

const DEFAULT_PREFS: MissingPersonTablePrefs = {
  density: "default",
  columns: {
    name: true,
    last_seen: true,
    status: true,
    submitted: true,
  },
}

export function useMissingPersonTablePrefs() {
  const [prefs, setPrefs] = useLocalStorage<MissingPersonTablePrefs>(
    STORAGE_KEY,
    DEFAULT_PREFS
  )

  const setDensity = (density: MissingPersonDensity) => {
    setPrefs((prev) => ({ ...prev, density }))
  }

  const setColumnVisible = (
    column: MissingPersonColumnKey,
    visible: boolean
  ) => {
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
