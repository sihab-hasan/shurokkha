import Link from "next/link"

export interface HomeStatTileProps {
  icon: React.ReactNode
  label: string
  value: string
  href: string
}

/**
 * One tile in the "At a glance" stats row. Renders the icon, label,
 * current value, and links to the matching operational surface.
 */
export function HomeStatTile({ icon, label, value, href }: HomeStatTileProps) {
  return (
    <Link
      href={href}
      className="rounded-xl border bg-card p-4 shadow-xs transition-colors hover:border-primary/40 hover:bg-card/80"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-2 font-heading text-2xl font-semibold tabular-nums">
        {value}
      </p>
    </Link>
  )
}
