import { Suspense } from "react"

import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { ProfileSections } from "@/features/settings/components/profile-sections"
import { ProfileSkeleton } from "@/features/settings/components/profile-skeleton"

/**
 * Server-renderable profile management page.
 *
 * Mirrors the management-page pattern used by `/account/assistance`,
 * `/account/missing-persons`, and `/account/donations`:
 *  - `<Section>` provides top-of-page breathing room from the shell header
 *  - `<Container padded={false}>` controls the horizontal alignment + rhythm
 *  - `<PageHeader>` ships in the initial HTML so the title is indexable
 *  - the data-driven UI lives in a `<Suspense>` boundary around the
 *    `<ProfileSections />` client island, with a pure markup `<ProfileSkeleton />`
 *    fallback so the page is fully renderable on the server
 */
export default function ProfilePage() {
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
