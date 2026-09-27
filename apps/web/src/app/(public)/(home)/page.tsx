import { Suspense } from "react"
import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { HomeActiveDisasters } from "@/features/home/components/home-active-disasters"
import { HomeGetInvolved } from "@/features/home/components/home-get-involved"
import { HomeHero } from "@/features/home/components/home-hero"
import { HomeNearbyShelters } from "@/features/home/components/home-nearby-shelters"
import { HomeSkeleton } from "@/features/home/components/home-skeleton"
import { HomeStatsRow } from "@/features/home/components/home-stats-row"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Shurokkha coordinates emergency response, shelters, volunteers, donations, and critical resources during disasters.",
}

/**
 * Home page shell. Page-level composition: hero → stats → active
 * disasters → nearby shelters → get involved. Each component is its
 * own peer call; the `<Suspense>` boundary wraps the data-driven
 * children so `HomeSkeleton` paints first and the live counts hydrate.
 */
export default function HomePage() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="space-y-12">
        <HomeHero />

        <Suspense fallback={<HomeSkeleton />}>
          <HomeStatsRow />
          <HomeActiveDisasters />
          <HomeNearbyShelters />
        </Suspense>

        <HomeGetInvolved />
      </Container>
    </Section>
  )
}
