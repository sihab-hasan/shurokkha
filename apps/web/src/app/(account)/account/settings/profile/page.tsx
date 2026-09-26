import { Suspense } from "react"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { ProfileSections } from "@/features/settings/components/profile-sections"
import { ProfileSkeleton } from "@/features/settings/components/profile-skeleton"

/**
 * Server-renderable profile page (under the settings tree).
 * Same composition as `/account/profile` — the layout above us renders
 * the settings tab nav, but the body uses the same management pattern.
 */
export default function ProfileSettingsPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Profile"
          description="Update how you appear to other helpers on Shurokkha."
        />
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileSections />
        </Suspense>
      </Container>
    </Section>
  )
}
