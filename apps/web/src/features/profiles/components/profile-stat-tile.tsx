interface ProfileStatTileProps {
  icon: React.ReactNode
  label: string
  value: string
}

/**
 * One statistic tile inside the profile's "About" card. Renders a
 * circular icon badge + label / value pair. Used 2-up in a 2-col grid.
 */
export function ProfileStatTile({ icon, label, value }: ProfileStatTileProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/55 p-4">
      <span className="flex size-10 items-center justify-center rounded-full bg-background text-primary shadow-xs">
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-medium">{value}</p>
      </div>
    </div>
  )
}
