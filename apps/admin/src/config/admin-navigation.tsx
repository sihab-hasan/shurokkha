import {
  ClipboardList,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
} from "lucide-react"

import type { ComponentType } from "react"

export type AdminNavItem = {
  label: string
  href: string
  icon?: ComponentType<{ className?: string }>
}

export const adminPrimaryNavigation: ReadonlyArray<AdminNavItem> = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Affected Areas",
    href: "/operations/affected-areas",
    icon: MapPin,
  },
  {
    label: "Rescue Teams",
    href: "/operations/rescue-teams",
    icon: ShieldCheck,
  },
  {
    label: "Team Management",
    href: "/operations/team-management",
    icon: ClipboardList,
  },
]

export const adminUtilityNavigation: ReadonlyArray<AdminNavItem> = []
