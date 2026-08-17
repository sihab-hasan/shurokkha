import {
  BellRing,
  Boxes,
  ChartNoAxesCombined,
  CircleGauge,
  ClipboardCheck,
  HeartHandshake,
  LifeBuoy,
  MapPinned,
  Settings,
  Siren,
  UsersRound,
} from "lucide-react"

export const adminPrimaryNavigation = [
  { label: "Overview", href: "/", icon: CircleGauge },
  { label: "Incidents", href: "/incidents", icon: Siren },
  { label: "Operations map", href: "/operations", icon: MapPinned },
  { label: "Shelters", href: "/shelters", icon: LifeBuoy },
  { label: "People & access", href: "/people", icon: UsersRound },
  { label: "Volunteers", href: "/volunteers", icon: HeartHandshake },
  { label: "Resources", href: "/resources", icon: Boxes },
  { label: "Approvals", href: "/approvals", icon: ClipboardCheck },
  { label: "Reports", href: "/reports", icon: ChartNoAxesCombined },
] as const

export const adminUtilityNavigation = [
  { label: "Notifications", href: "/notifications", icon: BellRing },
  { label: "Settings", href: "/settings", icon: Settings },
] as const
