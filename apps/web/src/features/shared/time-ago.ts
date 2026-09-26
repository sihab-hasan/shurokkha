/**
 * Tiny client-only relative-time formatter. Returns strings like
 * "just now", "2m ago", "3h ago", "4d ago", "Mar 12", or "Mar 12, 2025".
 *
 * Intentionally minimal — no Intl.RelativeTimeFormat dependency, no
 * seconds precision. We don't need it; we surface these strings as
 * metadata, not primary UI.
 */
export function timeAgo(input: string | Date | null | undefined): string {
  if (!input) return "—"
  const date = typeof input === "string" ? new Date(input) : input
  const ms = Date.now() - date.getTime()
  if (Number.isNaN(ms)) return "—"

  const seconds = Math.round(ms / 1000)
  if (seconds < 45) return "just now"
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  })
}
