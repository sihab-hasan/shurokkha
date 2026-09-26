import {
  Bell,
  FileText,
  HandHeart,
  HelpCircle,
  Home,
  House,
  LayoutDashboard,
  MessageSquareWarning,
  Search,
  ShieldAlert,
  Star,
  Users,
  Wallet,
} from "lucide-react"

import type { AccountModule, UserRole } from "@/lib/rbac"
import { routes } from "@/config/routes"

// ---------------------------------------------------------------------------
// Navigation item shape
// ---------------------------------------------------------------------------

export interface NavModule {
  id: string
  label: string
  href: string
  icon: React.ElementType
  /** Maps to an AccountModule for RBAC filtering */
  module?: AccountModule
  /** Optional explicit role whitelist — overrides module-based check */
  roles?: UserRole[]
  /** Sidebar category header label */
  category?: string
}

// ---------------------------------------------------------------------------
// All account navigation modules
// Grouped by category; the sidebar renders one <SidebarGroup> per category.
// ---------------------------------------------------------------------------

export const accountNavigationModules: NavModule[] = [
  // ── Overview ─────────────────────────────────────────────────────────────
  {
    id: "dashboard",
    label: "Dashboard",
    href: routes.account.dashboard,
    icon: LayoutDashboard,
    module: "dashboard",
    category: "Overview",
  },

  // ── Relief & Assistance ───────────────────────────────────────────────────
  {
    id: "assistance",
    label: "Assistance",
    href: routes.account.assistance,
    icon: HandHeart,
    module: "assistance",
    category: "Relief & Assistance",
  },
  {
    id: "missing-persons",
    label: "Missing Persons",
    href: routes.account.missingPersons,
    icon: Search,
    module: "missing-persons",
    category: "Relief & Assistance",
  },
  {
    id: "shelter",
    label: "Shelter",
    href: routes.account.shelter,
    icon: House,
    module: "shelter",
    category: "Relief & Assistance",
  },
  {
    id: "help-requests",
    label: "Help Requests",
    href: routes.account.helpRequests,
    icon: HelpCircle,
    module: "help-requests",
    category: "Relief & Assistance",
  },

  // ── Give & Participate ────────────────────────────────────────────────────
  {
    id: "donations",
    label: "Donations",
    href: routes.account.donations,
    icon: Wallet,
    module: "donations",
    category: "Give & Participate",
  },
  {
    id: "volunteering",
    label: "Volunteering",
    href: routes.account.volunteering,
    icon: Users,
    module: "volunteering",
    category: "Give & Participate",
  },

  // ── Household ─────────────────────────────────────────────────────────────
  {
    id: "household",
    label: "Household",
    href: routes.account.household,
    icon: Home,
    module: "household",
    category: "Household",
  },

  // ── Feedback & Advocacy ───────────────────────────────────────────────────
  {
    id: "appeals",
    label: "Appeals",
    href: routes.account.appeals,
    icon: ShieldAlert,
    module: "appeals",
    category: "Feedback & Advocacy",
  },
  {
    id: "complaints",
    label: "Complaints",
    href: routes.account.complaints,
    icon: MessageSquareWarning,
    module: "complaints",
    category: "Feedback & Advocacy",
  },
  {
    id: "feedback",
    label: "Feedback",
    href: routes.account.feedback,
    icon: Star,
    module: "feedback",
    category: "Feedback & Advocacy",
  },

  // ── Account ───────────────────────────────────────────────────────────────
  {
    id: "documents",
    label: "Documents",
    href: routes.account.documents,
    icon: FileText,
    module: "documents",
    category: "Account",
  },
  {
    id: "notifications",
    label: "Notifications",
    href: routes.account.notifications,
    icon: Bell,
    module: "notifications",
    category: "Account",
  },
]
