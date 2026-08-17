"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
)

const THEME_STORAGE_KEY = "theme"
const THEME_EVENT = "shurokkha:theme-change"
const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)"

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system"

  const value = window.localStorage.getItem(THEME_STORAGE_KEY)
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system"
}

function readSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light"
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? readSystemTheme() : theme
}

function applyTheme(theme: Theme) {
  const resolvedTheme = resolveTheme(theme)
  const root = document.documentElement

  root.classList.toggle("dark", resolvedTheme === "dark")
  root.style.colorScheme = resolvedTheme
}

function subscribe(callback: () => void) {
  const media = window.matchMedia(SYSTEM_THEME_QUERY)
  const handleChange = () => callback()

  window.addEventListener("storage", handleChange)
  window.addEventListener(THEME_EVENT, handleChange)
  media.addEventListener("change", handleChange)

  return () => {
    window.removeEventListener("storage", handleChange)
    window.removeEventListener(THEME_EVENT, handleChange)
    media.removeEventListener("change", handleChange)
  }
}

function getSnapshot() {
  const theme = readStoredTheme()
  return `${theme}:${resolveTheme(theme)}`
}

function getServerSnapshot() {
  return "system:light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const [theme, resolvedTheme] = snapshot.split(":") as [Theme, ResolvedTheme]

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme, resolvedTheme])

  const setTheme = React.useCallback((nextTheme: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    applyTheme(nextTheme)
    window.dispatchEvent(new Event(THEME_EVENT))
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
