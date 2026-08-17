import type { Metadata } from "next"

import { ContactHero } from "./_components/contact-hero"
import { ContactSupport } from "./_components/contact-support"

export const metadata: Metadata = {
  title: "Contact Shurokkha",
  description:
    "Contact Shurokkha for product support, partnerships, community coordination, accessibility, privacy, and safety concerns, and find key official Bangladesh helplines.",
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSupport />
    </>
  )
}
