"use client"

import Link from "next/link"
import { ChevronRight, Key } from "lucide-react"

import { SettingsCard } from "@shurokkha/ui/components/settings-card"
import { SettingsSection } from "@shurokkha/ui/components/settings-section"

import { routes } from "@/config/routes"

import { AvatarUploader } from "./avatar-uploader"
import { ProfileForm } from "./profile-form"

/**
 * Composition of every section that makes up the profile management
 * page. Mirrors the `*Sections` pattern used by assistance / missing-
 * persons / donations: a single client island that holds the whole
 * data-driven UI, while the route page itself stays as a Server
 * Component inside the Suspense boundary.
 *
 * Sections (top-to-bottom):
 *  - Identity → avatar upload
 *  - Account  → name, email, phone, timezone
 *  - Related  → deep link to the active-sessions page
 */
export function ProfileSections() {
  return (
    <div className="space-y-6">
      <ProfileIdentitySection />
      <ProfileAccountSection />
      <ProfileRelatedSection />
    </div>
  )
}

function ProfileIdentitySection() {
  return (
    <div className="space-y-4">
      <SettingsSection
        title="Avatar"
        description="A recognizable face helps responders and coordinators reach you faster."
      />
      <SettingsCard>
        <AvatarUploader />
      </SettingsCard>
    </div>
  )
}

function ProfileAccountSection() {
  return (
    <div className="space-y-4">
      <SettingsSection
        title="Account details"
        description="Your name, contact information, and timezone."
      />
      <SettingsCard>
        <ProfileForm />
      </SettingsCard>
    </div>
  )
}

function ProfileRelatedSection() {
  return (
    <div className="space-y-4">
      <SettingsSection
        title="Sessions"
        description="Review and manage the devices signed in to your account."
      />
      <SettingsCard flush>
        <Link
          href={routes.account.settingsSessions}
          className="group flex items-center gap-3 px-6 py-4 transition-colors duration-150 hover:bg-muted/40 focus-visible:bg-muted/60 focus-visible:outline-none"
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted text-muted-foreground transition-colors group-hover:text-foreground"
            aria-hidden
          >
            <Key className="size-4" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium">Active devices</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              See what&apos;s signed in and revoke access if needed.
            </p>
          </div>
          <ChevronRight
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </SettingsCard>
    </div>
  )
}
