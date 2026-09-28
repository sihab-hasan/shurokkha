import { THEME_BOOT_SCRIPT } from "@shurokkha/ui/lib/theme"

/**
 * Inline boot script that applies the persisted/system theme before the
 * first paint.
 *
 * Renders as a raw `<script>` element so it can be placed inside the root
 * layout's `<head>` (App Router has no `_document`, and `next/script`'s
 * `beforeInteractive` strategy is not allowed inside a React component —
 * Next would emit a console error at runtime).
 *
 * Marked `suppressHydrationWarning` because the script mutates
 * `<html class="dark">` before React mounts, which would otherwise trigger
 * a hydration mismatch.
 */
export function ThemeInitScript() {
  return (
    <script
      id="shurokkha-theme-init"
      dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
    />
  )
}
