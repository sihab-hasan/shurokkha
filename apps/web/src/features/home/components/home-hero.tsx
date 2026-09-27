import Link from "next/link"
import { MapPinned, Siren } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { PageHeader } from "@shurokkha/ui/layout/page-header"

/**
 * Hero band on the home page: headline + two top-level CTAs (Request
 * help, Find shelters). Server-renderable so the first paint already
 * shows the marketing copy.
 */
export function HomeHero() {
  return (
    <PageHeader
      eyebrow="Shurokkha"
      title="Trusted disaster information and community support"
      description="Verified alerts, assistance pathways, shelters, and resources — coordinated in one place so the next useful action is easier to find."
      actions={
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
          </Button>
        </div>
      }
    />
  )
}
