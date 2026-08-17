import { ContentContainer } from "@shurokkha/ui-patterns/layout"

import { ContactForm } from "./contact-form"
import { ContactOptions } from "./contact-options"

export function ContactSupport() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <ContentContainer className="py-0">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:gap-12 xl:gap-16">
          <ContactOptions />
          <ContactForm />
        </div>
      </ContentContainer>
    </section>
  )
}
