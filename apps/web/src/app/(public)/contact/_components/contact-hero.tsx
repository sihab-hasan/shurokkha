import Link from "next/link"
import { ArrowRight, MapPinned, PhoneCall, Siren } from "lucide-react"

import { StatusBanner } from "@shurokkha/ui-patterns/feedback"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { Button } from "@shurokkha/ui/components/button"

export function ContactHero() {
  return (
    <section className="bg-gradient-to-b from-danger/[0.07] via-background to-background">
      <ContentContainer className="py-10 sm:py-12 lg:py-14">
        <StatusBanner
          tone="critical"
          title="Need urgent assistance?"
          description="Shurokkha can help you request assistance and locate nearby support, but it does not replace emergency services. If someone is in immediate danger in Bangladesh, call 999 or use the appropriate official helpline for the situation."
          icon={<Siren />}
          action={
            <div className="flex flex-wrap gap-2">
              <Button nativeButton={false} render={<Link href="/get-help" />}>
                <Siren data-icon="inline-start" />
                Request help
              </Button>
              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href="/shelters" />}
              >
                <MapPinned data-icon="inline-start" />
                Find shelters
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                nativeButton={false}
                variant="ghost"
                render={<a href="tel:999" />}
              >
                <PhoneCall data-icon="inline-start" />
                Call 999
              </Button>
            </div>
          }
        />
      </ContentContainer>
    </section>
  )
}
