import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { routes } from "@/config/routes"

import { MissingPersonSections } from "@/features/missing-persons/components/missing-person-sections"
import { MissingPersonSkeleton } from "@/features/missing-persons/components/missing-person-skeleton"

/**
 * Server-renderable missing-persons page.
 *
 * The `<PageHeader>` ships in the initial HTML. The filter-aware sections
 * live inside a `<Suspense>` boundary so Next.js App Router allows
 * `useSearchParams()` to be called transitively inside the client island.
 */
export default function MissingPersonsPage() {
  return (
    <Section>
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Missing persons"
          actions={
            <Button
              nativeButton={false}
              render={<Link href={routes.account.createMissingPerson} />}
            >
              <Plus /> New report
            </Button>
          }
        />

        <Suspense fallback={<MissingPersonSkeleton />}>
          <MissingPersonSections />
        </Suspense>
      </Container>
    </Section>
  )
}
