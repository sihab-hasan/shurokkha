import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"

import { isAllowedUsername, normalizeUsername } from "@/config/username"

import { ProfileHeader } from "./_components/profile-header"
import { ProfileOverview } from "./_components/profile-overview"

const publicProfiles = {
  "sihab.xd": {
    name: "Sihab Hasan",
    username: "sihab.xd",
    role: "Citizen",
    bio: "Supporting safer, better-connected communities through Shurokkha.",
    joined: "Joined May 2023",
    location: "Riverview",
    hours: 48,
    missions: 12,
    peopleHelped: 86,
  },
} as const

type PublicUsername = keyof typeof publicProfiles

interface PublicProfilePageProps {
  params: Promise<{ username: string }>
}

function getPublicProfile(username: string) {
  const normalizedUsername = normalizeUsername(username)
  if (!isAllowedUsername(normalizedUsername)) return null
  return publicProfiles[normalizedUsername as PublicUsername] ?? null
}

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const profile = getPublicProfile(username)
  if (!profile) return { title: "Profile not found" }

  return {
    title: `${profile.name} (@${profile.username})`,
    description: profile.bio,
    alternates: { canonical: `/u/${profile.username}` },
  }
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params
  const profile = getPublicProfile(username)
  if (!profile) notFound()

  return (
    <section className="bg-gradient-to-b from-muted/45 to-background py-10 sm:py-14 lg:py-16">
      <ContentContainer size="narrow" className="py-0">
        <div className="flex flex-col gap-6">
          <ProfileHeader
            name={profile.name}
            username={profile.username}
            role={profile.role}
            joined={profile.joined}
            location={profile.location}
          />
          <ProfileOverview
            bio={profile.bio}
            location={profile.location}
            hours={profile.hours}
            missions={profile.missions}
            peopleHelped={profile.peopleHelped}
          />
        </div>
      </ContentContainer>
    </section>
  )
}
