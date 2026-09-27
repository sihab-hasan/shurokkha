export interface VolunteerOpportunityRowProps {
  title: string
  location: string
  commitment: string
  urgency: "Urgent" | "Ongoing"
}

/**
 * One row inside the opportunities table. Renders the role title,
 * location + commitment, and an urgency pill coloured by status.
 */
export function VolunteerOpportunityRow({
  title,
  location,
  commitment,
  urgency,
}: VolunteerOpportunityRowProps) {
  const isUrgent = urgency === "Urgent"

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          {location} · {commitment}
        </p>
      </div>
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isUrgent
            ? "bg-danger/10 text-danger"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {urgency}
      </span>
    </div>
  )
}
