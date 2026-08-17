import Link from "next/link"
import { ArrowRight, MapPinned, Siren } from "lucide-react"

import { StatusBanner } from "@shurokkha/ui-patterns/feedback"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { Button } from "@shurokkha/ui/components/button"

export function EmergencySupport() {
  return (
    <section className="bg-background pb-8 sm:pb-10">
      <ContentContainer>
        <StatusBanner
          tone="critical"
          title="Need urgent assistance?"
          description="Shurokkha can help you request assistance and locate nearby support, but it does not replace local emergency services. If someone is in immediate danger, contact the appropriate emergency service in your area."
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
            </div>
          }
        />
      </ContentContainer>
    </section>
  )
}
