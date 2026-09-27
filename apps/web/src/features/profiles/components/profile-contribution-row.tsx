interface ProfileContributionRowProps {
  icon: React.ReactNode
  label: string
  value: number
}

/**
 * Single metric row inside the public-profile "Public contribution"
 * sidebar. Renders an icon + label + numeric value with the same
 * padding/typography as the dashboard KPI cards.
 */
export function ProfileContributionRow({
  icon,
  label,
  value,
}: ProfileContributionRowProps) {
  return (
    <div className="rounded-lg bg-muted/45 p-4">
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {icon}
        {label}
      </span>
      <strong className="mt-1 block font-heading text-2xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </strong>
    </div>
  )
}
