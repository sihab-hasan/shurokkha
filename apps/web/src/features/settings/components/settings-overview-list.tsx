"use client"

import Link from "next/link"
import { Bell, ChevronRight, Key, Lock, Shield, User } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Kbd, KbdGroup } from "@shurokkha/ui/components/kbd"
import { SettingsCard } from "@shurokkha/ui/components/settings-card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import { routes } from "@/config/routes"
import { timeAgo } from "@/features/shared/time-ago"
import { useNotificationPrefs } from "@/features/settings/hooks/use-notification-prefs"
import { usePrivacyPrefs } from "@/features/settings/hooks/use-privacy-prefs"
import { useProfile } from "@/features/settings/hooks/use-profile"

type RowKey = "Profile" | "Notifications" | "Privacy" | "Security" | "Sessions"

type Row = {
  key: RowKey
  label: string
  description: string
  href: string
  icon: typeof Bell
  /** Single keypress hint shown on hover; hidden on mobile. */
  shortcut: string
}

const rows: Row[] = [
  {
    key: "Profile",
    label: "Profile",
    description: "Name, email, phone, avatar",
    href: routes.account.profile,
    icon: User,
    shortcut: "P",
  },
  {
    key: "Notifications",
    label: "Notifications",
    description: "Channels, events, quiet hours",
    href: routes.account.settingsNotifications,
    icon: Bell,
    shortcut: "N",
  },
  {
    key: "Privacy",
    label: "Privacy",
    description: "Sharing, visibility, donations",
    href: routes.account.settingsPrivacy,
    icon: Shield,
    shortcut: "V",
  },
  {
    key: "Security",
    label: "Security",
    description: "Password, two-factor, login history",
    href: routes.account.settingsSecurity,
    icon: Lock,
    shortcut: "S",
  },
  {
    key: "Sessions",
    label: "Sessions",
    description: "Active devices and sign-outs",
    href: routes.account.settingsSessions,
    icon: Key,
    shortcut: "D",
  },
]

export function SettingsOverviewList() {
  const profile = useProfile()
  const notifications = useNotificationPrefs()
  const privacy = usePrivacyPrefs()

  // Per-row: [badge variant, badge text, meta string]
  const annotations: Record<
    RowKey,
    {
      variant: "default" | "success" | "warning" | "outline"
      text: string | null
      meta: string
    }
  > = {
    Profile: {
      variant: profile.data?.two_factor_confirmed_at ? "success" : "outline",
      text: profile.data
        ? profile.data.two_factor_confirmed_at
          ? "2FA on"
          : "No 2FA"
        : null,
      meta: profile.data?.updated_at ? timeAgo(profile.data.updated_at) : "—",
    },
    Notifications: {
      variant: notifications.data
        ? activeChannels(notifications.data) > 0
          ? "success"
          : "outline"
        : "outline",
      text: notifications.data
        ? activeChannels(notifications.data) > 0
          ? `${activeChannels(notifications.data)} channels`
          : "All muted"
        : null,
      meta: notifications.data?.updated_at
        ? timeAgo(notifications.data.updated_at)
        : "—",
    },
    Privacy: {
      variant: privacy.data ? "outline" : "outline",
      text: privacy.data
        ? privacy.data.profile_visibility === "private"
          ? "Private"
          : privacy.data.profile_visibility === "helpers"
            ? "Helpers only"
            : "Public"
        : null,
      meta: privacy.data?.updated_at ? timeAgo(privacy.data.updated_at) : "—",
    },
    Security: {
      variant: profile.data?.two_factor_confirmed_at ? "success" : "outline",
      text: profile.data
        ? profile.data.two_factor_confirmed_at
          ? "2FA on"
          : "2FA off"
        : null,
      meta: profile.data?.updated_at ? timeAgo(profile.data.updated_at) : "—",
    },
    Sessions: {
      variant: profile.data ? "success" : "outline",
      text: profile.data ? "This device" : null,
      meta: "—",
    },
  }

  return (
    <SettingsCard flush>
      <ul className="divide-y divide-border/60">
        {rows.map((row) => {
          const Icon = row.icon
          const annotation = annotations[row.key]
          return (
            <li key={row.href}>
              <Link
                href={row.href}
                className="group flex items-center gap-3 px-6 py-4 transition-colors duration-150 hover:bg-muted/40 focus-visible:bg-muted/60 focus-visible:outline-none"
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted text-muted-foreground transition-colors group-hover:text-foreground"
                  aria-hidden
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{row.label}</p>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {row.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {annotation.text ? (
                    <Badge
                      variant={annotation.variant}
                      className="font-mono text-[10px] tracking-wide uppercase"
                    >
                      {annotation.text}
                    </Badge>
                  ) : null}
                  <span className="hidden font-mono text-[11px] text-muted-foreground/70 sm:inline">
                    {annotation.meta}
                  </span>
                  <KbdGroup className="hidden md:inline-flex">
                    <Kbd>G</Kbd>
                    <Kbd>{row.shortcut}</Kbd>
                  </KbdGroup>
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </SettingsCard>
  )
}

export function SettingsOverviewSkeleton() {
  return (
    <SettingsCard flush>
      <ul className="divide-y divide-border/60">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className="flex items-center gap-3 px-6 py-4">
            <Skeleton className="size-8 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="hidden size-5 md:block" />
          </li>
        ))}
      </ul>
    </SettingsCard>
  )
}

function activeChannels(prefs: {
  email_enabled: boolean
  sms_enabled: boolean
  push_enabled: boolean
}) {
  return [prefs.email_enabled, prefs.sms_enabled, prefs.push_enabled].filter(
    Boolean
  ).length
}
