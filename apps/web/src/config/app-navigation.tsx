import {
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  FileHeart,
  Gift,
  GraduationCap,
  HandHeart,
  History,
  LayoutDashboard,
  PackageCheck,
  PackageSearch,
  ReceiptText,
  Siren,
  UserSearch,
} from "lucide-react"

import { AlertIcon } from "@shurokkha/icons/alert-icon"
import { CommunityIcon } from "@shurokkha/icons/community-icon"
import { DonationIcon } from "@shurokkha/icons/donation-icon"
import { NotificationIcon } from "@shurokkha/icons/notification-icon"
import { SafetyIcon } from "@shurokkha/icons/safety-icon"
import { ShelterIcon } from "@shurokkha/icons/shelter-icon"

import type { NavModule } from "@/components/shells/app/app-navigation.types"

export type AppRole = "citizen" | "donor" | "volunteer"

const citizenNavigation: NavModule[] = [
  {
    id: "overview",
    label: "Overview",
    href: "",
    icon: LayoutDashboard,
    sections: [],
  },
  {
    id: "request-help",
    label: "Request help",
    href: "/request-help",
    icon: Siren,
    sections: [],
  },
  {
    id: "requests",
    label: "My requests",
    href: "/requests",
    icon: FileHeart,
    sections: [],
  },
  {
    id: "shelters",
    label: "Nearby shelters",
    href: "/shelters",
    icon: ShelterIcon,
    sections: [],
  },
  {
    id: "alerts",
    label: "Emergency alerts",
    href: "/alerts",
    icon: NotificationIcon,
    sections: [],
  },
  {
    id: "disasters",
    label: "Disaster information",
    href: "/disasters",
    icon: AlertIcon,
    sections: [],
  },
  {
    id: "missing-persons",
    label: "Missing persons",
    href: "/missing-persons",
    icon: UserSearch,
    sections: [],
  },
  {
    id: "safety",
    label: "Safety instructions",
    href: "/safety",
    icon: SafetyIcon,
    sections: [],
  },
]

const donorNavigation: NavModule[] = [
  {
    id: "overview",
    label: "Overview",
    href: "",
    icon: LayoutDashboard,
    sections: [],
  },
  {
    id: "donate",
    label: "Make a donation",
    href: "/donate",
    icon: Gift,
    sections: [],
  },
  {
    id: "donations",
    label: "My donations",
    href: "/donations",
    icon: DonationIcon,
    sections: [],
  },
  {
    id: "contributions",
    label: "Contributions",
    href: "/contributions",
    icon: History,
    sections: [],
  },
  {
    id: "tracking",
    label: "Donation tracking",
    href: "/tracking",
    icon: PackageSearch,
    sections: [],
  },
  {
    id: "campaigns",
    label: "Relief campaigns",
    href: "/campaigns",
    icon: HandHeart,
    sections: [],
  },
  {
    id: "receipts",
    label: "Receipts",
    href: "/receipts",
    icon: ReceiptText,
    sections: [],
  },
  {
    id: "impact",
    label: "Impact report",
    href: "/impact",
    icon: ChartNoAxesCombined,
    sections: [],
  },
]

const volunteerNavigation: NavModule[] = [
  {
    id: "overview",
    label: "Overview",
    href: "",
    icon: LayoutDashboard,
    sections: [],
  },
  {
    id: "assignments",
    label: "My assignments",
    href: "/assignments",
    icon: ClipboardCheck,
    sections: [],
  },
  {
    id: "missions",
    label: "Rescue missions",
    href: "/missions",
    icon: Siren,
    sections: [],
  },
  {
    id: "distributions",
    label: "Distribution tasks",
    href: "/distributions",
    icon: PackageCheck,
    sections: [],
  },
  {
    id: "shelters",
    label: "Assigned shelters",
    href: "/shelters",
    icon: ShelterIcon,
    sections: [],
  },
  {
    id: "schedule",
    label: "Schedule",
    href: "/schedule",
    icon: CalendarDays,
    sections: [],
  },
  {
    id: "team",
    label: "My team",
    href: "/team",
    icon: CommunityIcon,
    sections: [],
  },
  {
    id: "training",
    label: "Training",
    href: "/training",
    icon: GraduationCap,
    sections: [],
  },
]

export const appNavigation: Record<AppRole, NavModule[]> = {
  citizen: citizenNavigation,
  donor: donorNavigation,
  volunteer: volunteerNavigation,
}

export const appRoleMeta: Record<AppRole, { label: string; userName: string }> =
  {
    citizen: { label: "Citizen", userName: "Sihab Hasan" },
    donor: { label: "Donor", userName: "Sihab Hasan" },
    volunteer: { label: "Volunteer", userName: "Sihab Hasan" },
  }
