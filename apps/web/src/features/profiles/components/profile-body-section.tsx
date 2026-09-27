"use client"

import { usePublicProfile } from "../hooks/use-profile"

import { ProfileAboutCard } from "./profile-about-card"
import { ProfileContributionCard } from "./profile-contribution-card"
import { ProfileHeaderCard } from "./profile-header-card"
import { ProfileNotFound } from "./profile-not-found"
import { ProfileSkeleton } from "./profile-skeleton"

interface ProfileBodySectionProps {
  username: string
}

/**
 * Self-contained public-profile body island for `/u/{username}`.
 * Owns the data fetch via `usePublicProfile` and the
 * pending / error / not-found branches; on success, renders the
 * header, about, and contribution cards directly. The route page
 * renders this as a single peer call inside `<Suspense fallback={…}>`
 * so the page itself stays a server component.
 */
export function ProfileBodySection({ username }: ProfileBodySectionProps) {
  const { data, isPending, isError, error } = usePublicProfile(username)

  if (isPending) {
    return <ProfileSkeleton username={username} />
  }

  if (isError || !data?.data) {
    return (
      <ProfileNotFound
        username={username}
        message={
          (error as Error | undefined)?.message ??
          "This profile is unavailable."
        }
      />
    )
  }

  const profile = data.data

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeaderCard profile={profile} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ProfileAboutCard profile={profile} />
        <ProfileContributionCard profile={profile} />
      </div>
    </div>
  )
}