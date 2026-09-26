"use client"

import { useMemo } from "react"

import { useLocalStorage } from "@/lib/use-local-storage"

export type AssistanceDensity = "compact" | "default" | "comfortable"

export const ASSISTANCE_COLUMN_KEYS = [
  "id",
  "request",
  "address",
  "priority",
  "status",
  "submitted",
] as const
export type AssistanceColumnKey = (typeof ASSISTANCE_COLUMN_KEYS)[number]

interface AssistanceTablePrefs {
  density: AssistanceDensity
  columns: Record<AssistanceColumnKey, boolean>
}

const STORAGE_KEY = "shurokkha:assistance:table-prefs:v1"

const DEFAULT_PREFS: AssistanceTablePrefs = {
  density: "default",
  columns: {
    id: true,
    request: true,
    address: true,
    priority: true,
    status: true,
    submitted: true,
  },
}

export function useAssistanceTablePrefs() {
  const [prefs, setPrefs] = useLocalStorage<AssistanceTablePrefs>(
    STORAGE_KEY,
    DEFAULT_PREFS
  )

  const setDensity = (density: AssistanceDensity) => {
    setPrefs((prev) => ({ ...prev, density }))
  }

  const setColumnVisible = (column: AssistanceColumnKey, visible: boolean) => {
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
