import { Suspense } from "react"
import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { ProfileBodySection, ProfileSkeleton } from "@/features/profiles"
import { normalizeUsername, isAllowedUsername } from "@/config/username"

interface PublicProfilePageProps {
  params: Promise<{ username: string }>
}

/**
 * Public profile page shell. Validates the username shape early so
 * disallowed segments return a 404 without ever hitting the network,
 * then defers to {@link ProfileBodySection} for the data-driven view.
 */
export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username: rawUsername } = await params
  const username = normalizeUsername(rawUsername)

  if (!isAllowedUsername(username)) {
    return (
      <Section className="py-16">
        <Container>
          <p className="text-sm text-muted-foreground">
            Invalid username format.
          </p>
        </Container>
      </Section>
    )
  }

  return (
    <section className="bg-gradient-to-b from-muted/45 to-background py-10 sm:py-14 lg:py-16">
      <Section className="py-0">
        <Container>
          <Suspense fallback={<ProfileSkeleton username={username} />}>
            <ProfileBodySection username={username} />
          </Suspense>
        </Container>
      </Section>
    </section>
  )
}

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params
  return {
    title: `@${normalizeUsername(username)}`,
    description: `View ${normalizeUsername(username)}'s public profile on Shurokkha.`,
  }
}
