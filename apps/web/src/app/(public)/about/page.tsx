import type { Metadata } from "next"

import { AboutHero } from "./_components/about-hero"
import { HowWeWorkSection } from "./_components/how-we-work-section"
import { MissionSection } from "./_components/mission-section"
import { TrustSafetySection } from "./_components/trust-safety-section"
import { ValuesSection } from "./_components/values-section"

export const metadata: Metadata = {
  title: "About Shurokkha",
  description:
    "Learn why Shurokkha is being built, what the platform helps people do, and the principles guiding disaster information, support coordination, safety, and recovery.",
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionSection />
      <HowWeWorkSection />
      <ValuesSection />
      <TrustSafetySection />
    </>
  )
}
