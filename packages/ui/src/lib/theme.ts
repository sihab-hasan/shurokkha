export type Theme = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

export const THEME_STORAGE_KEY = "theme"
export const THEME_EVENT = "shurokkha:theme-change"
export const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)"
export const THEME_CHANGING_CLASS = "theme-changing"

export function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system"
}

/**
 * Runs before Next.js hydration so the first painted document already has the
 * user's stored/system theme. Keep this script tiny because it is critical UI.
 */
export const THEME_BOOT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var theme = stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system";
    var resolved = theme === "system"
      ? (window.matchMedia(${JSON.stringify(SYSTEM_THEME_QUERY)}).matches ? "dark" : "light")
      : theme;
    var root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
    root.dataset.theme = resolved;
  } catch (_) {}
})();
`.trim()
