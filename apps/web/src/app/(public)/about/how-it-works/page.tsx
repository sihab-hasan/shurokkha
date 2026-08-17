import type { Metadata } from "next"

import { HowItWorksHero } from "./_components/how-it-works-hero"
import { ParticipationSection } from "./_components/participation-section"
import { RecoveryCycleSection } from "./_components/recovery-cycle-section"
import { StepsSection } from "./_components/steps-section"
import { TrustSection } from "./_components/trust-section"

export const metadata: Metadata = {
  title: "How Shurokkha Works",
  description:
    "See how Shurokkha connects verified information, assistance, resources, volunteering, and recovery support.",
}

export default function HowShurokkhaWorksPage() {
  return (
    <>
      <HowItWorksHero />
      <StepsSection />
      <RecoveryCycleSection />
      <ParticipationSection />
      <TrustSection />
    </>
  )
}
