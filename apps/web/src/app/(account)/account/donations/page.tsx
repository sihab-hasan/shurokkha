import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { routes } from "@/config/routes"

import { DonationsSections } from "@/features/donations/components/donations-sections"
import { DonationsSkeleton } from "@/features/donations/components/donations-skeleton"

/**
 * Server-renderable donations page.
 *
 * The `<Section>` wrapper provides the top-of-page breathing room from
 * the shell header. Inter-section spacing is controlled by `space-y-6`
 * on the container. The filter-aware sections live inside a `<Suspense>`
 * boundary so Next.js App Router allows `useSearchParams()` to be
 * called transitively inside the client island.
 */
export default function DonationsPage() {
  return (
    <Section>
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Donations & Contributions"
          description="Track every donation you have made and the impact it is having."
          actions={
            <Button
              nativeButton={false}
              render={<Link href={routes.public.donate} />}
            >
              <Plus /> Make a donation
            </Button>
          }
        />

        <Suspense fallback={<DonationsSkeleton />}>
          <DonationsSections />
        </Suspense>
      </Container>
    </Section>
  )
}
