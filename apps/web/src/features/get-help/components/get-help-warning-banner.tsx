import { Siren } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"

/**
 * High-emphasis emergency banner pinned to the top of `/get-help`. Tells
 * visitors to dial 999 for immediate danger and offers a destructive
 * "Call 999" CTA rendered as a tel: link.
 */
export function GetHelpWarningBanner() {
  return (
    <Card className="border-danger/30 bg-danger/[0.04]">
      <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-danger">Emergency warning</p>
          <p className="max-w-2xl text-sm leading-6 text-foreground">
            If someone is in immediate danger, contact emergency services first.
            Shurokkha can help with coordination, but it is not a replacement
            for the official 999 response or local disaster response teams.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<a href="tel:999" />}
          variant="destructive"
        >
          <Siren data-icon="inline-start" />
          Call 999
        </Button>
      </CardContent>
    </Card>
  )
}
