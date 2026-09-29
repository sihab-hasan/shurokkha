import {
  AlertTriangle,
  Building2,
  ClipboardList,
  FileText,
  HeartHandshake,
  Layers,
  LayoutDashboard,
  MapPin,
  Newspaper,
  Package,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
  UsersRound,
  Warehouse,
} from "lucide-react"

import type { ComponentType } from "react"

export type AdminNavItem = {
  label: string
  href: string
  icon?: ComponentType<{ className?: string }>
  badge?: string | number
  category?: string
}

export const adminPrimaryNavigation: ReadonlyArray<AdminNavItem> = [
  // ── General ──────────────────────────────────────────────────────────────
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
    category: "Overview",
  },
  {
    label: "Operations Console",
    href: "/operations",
    icon: Layers,
    category: "Overview",
  },

  // ── Emergency Response ───────────────────────────────────────────────────
  {
    label: "Affected Areas",
    href: "/operations/affected-areas",
    icon: MapPin,
    category: "Emergency Operations",
  },
  {
    label: "Rescue Teams",
    href: "/operations/rescue-teams",
    icon: ShieldCheck,
    category: "Emergency Operations",
  },
  {
    label: "Team Assignments",
    href: "/operations/team-management",
    icon: ClipboardList,
    category: "Emergency Operations",
  },
  {
    label: "Emergency Alerts",
    href: "/operations/alerts",
    icon: AlertTriangle,
    category: "Emergency Operations",
  },
  {
    label: "Evacuation Shelters",
    href: "/operations/shelters",
    icon: Building2,
    category: "Emergency Operations",
  },

  // ── Relief & Logistics ───────────────────────────────────────────────────
  {
    label: "Volunteer Force",
    href: "/operations/volunteers",
    icon: Users,
    category: "Relief & Logistics",
  },
  {
    label: "Aid Warehouses",
    href: "/operations/warehouses",
    icon: Warehouse,
    category: "Relief & Logistics",
  },
  {
    label: "Relief Donations",
    href: "/operations/donations",
    icon: Package,
    category: "Relief & Logistics",
  },
  {
    label: "Fundraisers",
    href: "/operations/fundraises",
    icon: HeartHandshake,
    category: "Relief & Logistics",
  },

  // ── Content & Publishing ─────────────────────────────────────────────────
  {
    label: "Disaster Guides",
    href: "/operations/guides",
    icon: FileText,
    category: "Content & Publishing",
  },
  {
    label: "News & Updates",
    href: "/operations/news",
    icon: Newspaper,
    category: "Content & Publishing",
  },

  // ── Intelligence & Reports ───────────────────────────────────────────────
  {
    label: "Reports & Analytics",
    href: "/reports",
    icon: TrendingUp,
    category: "Intelligence & Reports",
  },
]

export const adminUtilityNavigation: ReadonlyArray<AdminNavItem> = [
  {
    label: "User Accounts",
    href: "/users",
    icon: UsersRound,
    category: "System Administration",
  },
  {
    label: "Security Audit Logs",
    href: "/login-audits",
    icon: ShieldAlert,
    category: "System Administration",
  },
]
