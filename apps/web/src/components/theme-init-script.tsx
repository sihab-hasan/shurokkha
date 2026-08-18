import Script from "next/script"
import { THEME_BOOT_SCRIPT } from "@shurokkha/ui/lib/theme"

/** Applies the persisted/system theme before React hydration and first paint. */
export function ThemeInitScript() {
  return (
    <Script id="shurokkha-theme-init" strategy="beforeInteractive">
      {THEME_BOOT_SCRIPT}
    </Script>
  )
}
