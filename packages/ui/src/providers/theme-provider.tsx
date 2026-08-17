"use client"

import * as React from "react"

import {
  isTheme,
  SYSTEM_THEME_QUERY,
  THEME_CHANGING_CLASS,
  THEME_EVENT,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
} from "../lib/theme"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
)

let removeTransitionFrame: number | null = null
let cleanupTransitionFrame: number | null = null

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system"

  const value = window.localStorage.getItem(THEME_STORAGE_KEY)
  return isTheme(value) ? value : "system"
}

function readSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light"
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? readSystemTheme() : theme
}

/**
 * Keep the no-transition guard active for one painted frame. This prevents
 * components using transition-colors from cross-fading every semantic token
 * when the root light/dark class changes.
 */
function guardThemeTransition(root: HTMLElement) {
  root.classList.add(THEME_CHANGING_CLASS)

  if (removeTransitionFrame !== null) {
    window.cancelAnimationFrame(removeTransitionFrame)
  }

  if (cleanupTransitionFrame !== null) {
    window.cancelAnimationFrame(cleanupTransitionFrame)
  }

  removeTransitionFrame = window.requestAnimationFrame(() => {
    cleanupTransitionFrame = window.requestAnimationFrame(() => {
      root.classList.remove(THEME_CHANGING_CLASS)
      removeTransitionFrame = null
      cleanupTransitionFrame = null
    })
  })
}

function applyTheme(theme: Theme) {
  const resolvedTheme = resolveTheme(theme)
  const root = document.documentElement
  const shouldBeDark = resolvedTheme === "dark"

  const classNeedsUpdate = root.classList.contains("dark") !== shouldBeDark
  const schemeNeedsUpdate = root.style.colorScheme !== resolvedTheme
  const dataThemeNeedsUpdate = root.dataset.theme !== resolvedTheme

  // setTheme() applies immediately, then the store subscription re-renders.
  // Avoid a second style recalculation when the DOM is already synchronized.
  if (!classNeedsUpdate && !schemeNeedsUpdate && !dataThemeNeedsUpdate) return

  guardThemeTransition(root)
  root.classList.toggle("dark", shouldBeDark)
  root.style.colorScheme = resolvedTheme
  root.dataset.theme = resolvedTheme
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

  // The inline ThemeScript handles the first document paint. This layout
  // effect keeps system-theme changes synchronized before React paints.
  React.useLayoutEffect(() => {
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
