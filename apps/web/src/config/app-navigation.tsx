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
import { routes } from "@/config/routes"

export type AppRole = "citizen" | "donor" | "volunteer"

const citizenNavigation: NavModule[] = [
  {
    id: "overview",
    label: "Overview",
    href: routes.citizen.home,
    icon: LayoutDashboard,
    sections: [],
  },
  {
    id: "request-help",
    label: "Request help",
    href: routes.citizen.requestHelp,
    icon: Siren,
    sections: [],
  },
  {
    id: "requests",
    label: "My requests",
    href: routes.citizen.requests,
    icon: FileHeart,
    sections: [],
  },
  {
    id: "shelters",
    label: "Nearby shelters",
    href: routes.citizen.shelters,
    icon: ShelterIcon,
    sections: [],
  },
  {
    id: "alerts",
    label: "Emergency alerts",
    href: routes.citizen.alerts,
    icon: NotificationIcon,
    sections: [],
  },
  {
    id: "disasters",
    label: "Disaster information",
    href: routes.citizen.disasters,
    icon: AlertIcon,
    sections: [],
  },
  {
    id: "missing-persons",
    label: "Missing persons",
    href: routes.citizen.missingPersons,
    icon: UserSearch,
    sections: [],
  },
  {
    id: "safety",
    label: "Safety instructions",
    href: routes.citizen.safety,
    icon: SafetyIcon,
    sections: [],
  },
]

const donorNavigation: NavModule[] = [
  {
    id: "overview",
    label: "Overview",
    href: routes.donor.home,
    icon: LayoutDashboard,
    sections: [],
  },
  {
    id: "donate",
    label: "Make a donation",
    href: routes.donor.donate,
    icon: Gift,
    sections: [],
  },
  {
    id: "donations",
    label: "My donations",
    href: routes.donor.donations,
    icon: DonationIcon,
    sections: [],
  },
  {
    id: "contributions",
    label: "Contributions",
    href: routes.donor.contributions,
    icon: History,
    sections: [],
  },
  {
    id: "tracking",
    label: "Donation tracking",
    href: routes.donor.tracking,
    icon: PackageSearch,
    sections: [],
  },
  {
    id: "campaigns",
    label: "Relief campaigns",
    href: routes.donor.campaigns,
    icon: HandHeart,
    sections: [],
  },
  {
    id: "receipts",
    label: "Receipts",
    href: routes.donor.receipts,
    icon: ReceiptText,
    sections: [],
  },
  {
    id: "impact",
    label: "Impact report",
    href: routes.donor.impact,
    icon: ChartNoAxesCombined,
    sections: [],
  },
]

const volunteerNavigation: NavModule[] = [
  {
    id: "overview",
    label: "Overview",
    href: routes.volunteer.home,
    icon: LayoutDashboard,
    sections: [],
  },
  {
    id: "assignments",
    label: "My assignments",
    href: routes.volunteer.assignments,
    icon: ClipboardCheck,
    sections: [],
  },
  {
    id: "missions",
    label: "Rescue missions",
    href: routes.volunteer.missions,
    icon: Siren,
    sections: [],
  },
  {
    id: "distributions",
    label: "Distribution tasks",
    href: routes.volunteer.distributions,
    icon: PackageCheck,
    sections: [],
  },
  {
    id: "shelters",
    label: "Assigned shelters",
    href: routes.volunteer.shelters,
    icon: ShelterIcon,
    sections: [],
  },
  {
    id: "schedule",
    label: "Schedule",
    href: routes.volunteer.schedule,
    icon: CalendarDays,
    sections: [],
  },
  {
    id: "team",
    label: "My team",
    href: routes.volunteer.team,
    icon: CommunityIcon,
    sections: [],
  },
  {
    id: "training",
    label: "Training",
    href: routes.volunteer.training,
    icon: GraduationCap,
    sections: [],
  },
]

export const appNavigation: Record<AppRole, NavModule[]> = {
  citizen: citizenNavigation,
  donor: donorNavigation,
  volunteer: volunteerNavigation,
}

export const appRoleMeta: Record<AppRole, { label: string }> = {
  citizen: { label: "Citizen" },
  donor: { label: "Donor" },
  volunteer: { label: "Volunteer" },
}
