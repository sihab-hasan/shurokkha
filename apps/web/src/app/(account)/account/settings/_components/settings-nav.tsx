"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Key, LayoutGrid, Lock, Shield, User } from "lucide-react"

import { routes } from "@/config/routes"
import { cn } from "@shurokkha/ui/lib/utils"

const tabs = [
  { label: "Overview", href: routes.account.settings, icon: LayoutGrid },
  {
    label: "Profile",
    href: routes.account.profile,
    icon: User,
    // Match the Settings sub-route so the tab stays highlighted when
    // a user lands on the alternate `/account/settings/profile` entry.
    match: [routes.account.profile, "/account/settings/profile"],
  },
  {
    label: "Notifications",
    href: routes.account.settingsNotifications,
    icon: Bell,
  },
  { label: "Privacy", href: routes.account.settingsPrivacy, icon: Shield },
  { label: "Security", href: routes.account.settingsSecurity, icon: Lock },
  { label: "Sessions", href: routes.account.settingsSessions, icon: Key },
]

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border/60"
      aria-label="Settings Navigation Tabs"
    >
      {tabs.map((tab) => {
        // `match` lets a single tab claim multiple paths (e.g. Profile
        // highlights for both `/account/profile` and the legacy
        // `/account/settings/profile` entry).
        const isActive = tab.match
          ? tab.match.includes(pathname)
          : pathname === tab.href
        const Icon = tab.icon

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "-mb-px inline-flex items-center gap-2 border-b-2 px-1 pt-3 pb-3 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
