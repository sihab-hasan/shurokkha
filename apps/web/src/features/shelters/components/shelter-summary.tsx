/**
 * Small inline summary line rendered next to the filter bar to give
 * visitors at-a-glance context ("12 shelters · 4 open · 2 full").
 */
interface ShelterSummaryProps {
  total: number
  open: number
  full: number
}

export function ShelterSummary({ total, open, full }: ShelterSummaryProps) {
  return (
    <p className="text-xs text-muted-foreground">
      {total} {total === 1 ? "shelter" : "shelters"} · {open} open · {full} full
    </p>
  )
}
