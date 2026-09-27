import { HandHeart, LifeBuoy, Users } from "lucide-react"

import { VolunteerRoleCard } from "./volunteer-role-card"

const ROLES = [
  {
    title: "Field volunteer",
    description:
      "On-the-ground support at shelters, distribution points, and welfare desks. Hours, locations, and skills tracked through verified check-ins.",
    icon: HandHeart,
  },
  {
    title: "Skilled responder",
    description:
      "Medical, search-and-rescue, mental-health first aid, and logistics professionals matched to assignments via the coordination team.",
    icon: LifeBuoy,
  },
  {
    title: "Community lead",
    description:
      "Local organizers who connect neighbours, elder groups, and community groups with verified Shurokkha pathways in their area.",
    icon: Users,
  },
] as const

/**
 * 3-up grid of `VolunteerRoleCard`s describing the kinds of roles
 * Shurokkha coordinates.
 */
export function VolunteerRolesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {ROLES.map((role) => (
        <VolunteerRoleCard key={role.title} {...role} />
      ))}
    </div>
  )
}
